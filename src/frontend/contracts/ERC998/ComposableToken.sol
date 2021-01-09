// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../interfaces/erc998/IERC998ERC20TopDown.sol";
import "../interfaces/erc998/IERC998ERC721BottomUp.sol";
import "../interfaces/erc998/IERC998ERC721TopDown.sol";

contract ComposableToken is ERC721, ERC998ERC721TopDown, ERC998ERC721TopDownEnumerable, IERC998ERC20TopDown, ERC998ERC20TopDownEnumerable {

    using Address for address;

    // return this.rootOwnerOf.selector ^ this.rootOwnerOfChild.selector ^
    //   this.tokenOwnerOf.selector ^ this.ownerOfChild.selector;
    // bytes32 constant ERC998_MAGIC_VALUE = 0xcd740db5;
    bytes4 constant ERC998_MAGIC_VALUE = 0xcd740db5;

    uint256 tokenCount = 0;

    // tokenId => token owner
    mapping(uint256 => address) internal tokenIdToTokenOwner;

    // root token owner address => (tokenId => approved address)
    mapping(address => mapping(uint256 => address)) internal rootOwnerAndTokenIdToApprovedAddress;

    // token owner address => token count
    mapping(address => uint256) internal tokenOwnerToTokenCount;

    // token owner => (operator address => bool)
    mapping(address => mapping(address => bool)) internal tokenOwnerToOperators;

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) public {
        _setBaseURI(baseURI);
    }

    // wrapper on minting new 721
    function mint(address _to) public returns (uint256) {
        tokenCount++;
        uint256 tokenCount_ = tokenCount;
        tokenIdToTokenOwner[tokenCount_] = _to;
        tokenOwnerToTokenCount[_to]++;
        return tokenCount_;
    }

    ////////////////////////////////////////////////////////
    // ERC721 implementation
    ////////////////////////////////////////////////////////

    // function isContract(address _addr) internal view returns (bool) {
    //     uint256 size;
    //     assembly { size := extcodesize(_addr) }
    //     return size > 0;
    // }

    function rootOwnerOf(uint256 _tokenId) public view override returns (bytes32 rootOwner) {
        return rootOwnerOfChild(address(0), _tokenId);
    }

    // returns the owner at the top of the tree of composables
    // Use Cases handled:
    // Case 1: Token owner is this contract and token.
    // Case 2: Token owner is other top-down composable
    // Case 3: Token owner is other contract
    // Case 4: Token owner is user
    function rootOwnerOfChild(address _childContract, uint256 _childTokenId) public view override returns (bytes32 rootOwner) {
        address rootOwnerAddress;
        if (_childContract != address(0)) {
            (rootOwnerAddress, _childTokenId) = _ownerOfChild(_childContract, _childTokenId);
        }
        else {
            rootOwnerAddress = tokenIdToTokenOwner[_childTokenId];
        }
        // Case 1: Token owner is this contract and token.
        while (rootOwnerAddress == address(this)) {
            (rootOwnerAddress, _childTokenId) = _ownerOfChild(rootOwnerAddress, _childTokenId);
        }

        bool callSuccess;
        // bytes memory _calldata;
        // 0xed81cdda == rootOwnerOfChild(address,uint256)
        bytes memory _calldata = abi.encodeWithSelector(0xed81cdda, address(this), _childTokenId);
        assembly {
            callSuccess := staticcall(gas(), rootOwnerAddress, add(_calldata, 0x20), mload(_calldata), _calldata, 0x20)
            if callSuccess {
                rootOwner := mload(_calldata)
            }
        }
        if(callSuccess == true && rootOwner >> 224 == ERC998_MAGIC_VALUE) {
            // Case 2: Token owner is other top-down composable
            return rootOwner;
        }
        else {
            // Case 3: Token owner is other contract
            // Or
            // Case 4: Token owner is user
            // return ERC998_MAGIC_VALUE << 224 | bytes32(rootOwnerAddress);
            return ERC998_MAGIC_VALUE << 224 | bytes20(rootOwnerAddress);
        }
    }


    // returns the owner at the top of the tree of composables

    function ownerOf(uint256 _tokenId) public view override returns (address tokenOwner) {
        tokenOwner = tokenIdToTokenOwner[_tokenId];
        require(tokenOwner != address(0), "ComposableToken: Owner is not set");
        return tokenOwner;
    }

    function balanceOf(address _tokenOwner) public view override returns (uint256) {
        require(_tokenOwner != address(0), "ComposableToken: Owner not specified");
        return tokenOwnerToTokenCount[_tokenOwner];
    }


    function approve(address _approved, uint256 _tokenId) public override {
        // address rootOwner = address(rootOwnerOf(_tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(_tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender], "ComposableToken: Error in approval");
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] = _approved;
        emit Approval(rootOwner, _approved, _tokenId);
    }

    function getApproved(uint256 _tokenId) public override view returns (address)  {
        // address rootOwner = address(rootOwnerOf(_tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(_tokenId)));
        return rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId];
    }

    function setApprovalForAll(address _operator, bool _approved) public override {
        require(_operator != address(0), "ComposableToken: Operator can't be 0x");
        tokenOwnerToOperators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) public view override returns (bool)  {
        require(_owner != address(0), "ComposableToken: Owner can't be 0x");
        require(_operator != address(0), "ComposableToken: Operator can't be 0x");
        return tokenOwnerToOperators[_owner][_operator];
    }


    function _transferFrom(address _from, address _to, uint256 _tokenId) private {
        require(_from != address(0), "ComposableToken: From can't be 0x");
        require(tokenIdToTokenOwner[_tokenId] == _from, "ComposableToken: Not the owner");
        require(_to != address(0), "ComposableToken: To can't be 0x");

        if(msg.sender != _from) {
            bytes32 rootOwner;
            bool callSuccess;
            // 0xed81cdda == rootOwnerOfChild(address,uint256)
            bytes memory _calldata = abi.encodeWithSelector(0xed81cdda, address(this), _tokenId);
            assembly {
                callSuccess := staticcall(gas(), _from, add(_calldata, 0x20), mload(_calldata), _calldata, 0x20)
                if callSuccess {
                    rootOwner := mload(_calldata)
                }
            }
            if(callSuccess == true) {
                require(rootOwner >> 224 != ERC998_MAGIC_VALUE, "ComposableToken: Token is child of other top down composable");
            }
            require(tokenOwnerToOperators[_from][msg.sender] ||
            rootOwnerAndTokenIdToApprovedAddress[_from][_tokenId] == msg.sender, "ComposableToken: Sender not an operator or approved address");
        }

        // clear approval
        if (rootOwnerAndTokenIdToApprovedAddress[_from][_tokenId] != address(0)) {
            delete rootOwnerAndTokenIdToApprovedAddress[_from][_tokenId];
            emit Approval(_from, address(0), _tokenId);
        }

        // remove and transfer token
        if (_from != _to) {
            assert(tokenOwnerToTokenCount[_from] > 0);
            tokenOwnerToTokenCount[_from]--;
            tokenIdToTokenOwner[_tokenId] = _to;
            tokenOwnerToTokenCount[_to]++;
        }
        emit Transfer(_from, _to, _tokenId);

    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public override {
        _transferFrom(_from, _to, _tokenId);
    }

    // function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
    //     _transferFrom(_from, _to, _tokenId);
    //     if (_to.isContract()) {
    //         bytes4 retval = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, "");
    //         require(retval == _ERC721_RECEIVED, "ComposableToken: Failed to IERC721Receiver");
    //     }
    // }

    // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) external {
    //     _transferFrom(_from, _to, _tokenId);
    //     if (_to.isContract()) {
    //         bytes4 retval = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
    //         require(retval == _ERC721_RECEIVED, "ComposableToken: Failed to IERC721Receiver");
    //     }
    // }

    ////////////////////////////////////////////////////////
    // ERC998ERC721 and ERC998ERC721Enumerable implementation
    ////////////////////////////////////////////////////////

    // tokenId => child contract
    mapping(uint256 => address[]) private childContracts;

    // tokenId => (child address => contract index+1)
    mapping(uint256 => mapping(address => uint256)) private childContractIndex;

    // tokenId => (child address => array of child tokens)
    mapping(uint256 => mapping(address => uint256[])) private childTokens;

    // tokenId => (child address => (child token => child index+1)
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) private childTokenIndex;

    // child address => childId => tokenId
    mapping(address => mapping(uint256 => uint256)) internal childTokenOwner;


    function removeChild(uint256 _tokenId, address _childContract, uint256 _childTokenId) private {
        uint256 tokenIndex = childTokenIndex[_tokenId][_childContract][_childTokenId];
        require(tokenIndex != 0, "Child token not owned by token.");

        // remove child token
        uint256 lastTokenIndex = childTokens[_tokenId][_childContract].length - 1;
        uint256 lastToken = childTokens[_tokenId][_childContract][lastTokenIndex];
        if (_childTokenId == lastToken) {
            childTokens[_tokenId][_childContract][tokenIndex - 1] = lastToken;
            childTokenIndex[_tokenId][_childContract][lastToken] = tokenIndex;
        }
        // childTokens[_tokenId][_childContract].length--;
        childTokens[_tokenId][_childContract].pop();
        delete childTokenIndex[_tokenId][_childContract][_childTokenId];
        delete childTokenOwner[_childContract][_childTokenId];

        // remove contract
        if (lastTokenIndex == 0) {
            uint256 lastContractIndex = childContracts[_tokenId].length - 1;
            address lastContract = childContracts[_tokenId][lastContractIndex];
            if (_childContract != lastContract) {
                uint256 contractIndex = childContractIndex[_tokenId][_childContract];
                childContracts[_tokenId][contractIndex] = lastContract;
                childContractIndex[_tokenId][lastContract] = contractIndex;
            }
            // childContracts[_tokenId].length--;
            childContracts[_tokenId].pop();
            delete childContractIndex[_tokenId][_childContract];
        }
    }

    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external override {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0,
                "ComposableToken: tokenId || _childTokenId not found");
        require(tokenId == _fromTokenId, "ComposableToken: tokenId != _fromTokenId");
        require(_to != address(0), "ComposableToken: cannot be 0x");
        // address rootOwner = address(rootOwnerOf(tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
                rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender, "ComposableToken: sender is not the owner");
        removeChild(tokenId, _childContract, _childTokenId);
        ERC721(_childContract).safeTransferFrom(address(this), _to, _childTokenId);
        emit TransferChild(tokenId, _to, _childContract, _childTokenId);
    }

    function safeTransferChild(uint256 _fromTokenId,
                               address _to,
                               address _childContract,
                               uint256 _childTokenId,
                               bytes calldata _data) external override {

        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0,
                "ComposableToken: tokenId || _childTokenId not found");
        require(tokenId == _fromTokenId, "ComposableToken: tokenId != _fromTokenId");
        require(_to != address(0), "ComposableToken: cannot be 0x");
        // address rootOwner = address(rootOwnerOf(tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
                rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender, "ComposableToken: sender is not the owner");
        removeChild(tokenId, _childContract, _childTokenId);
        ERC721(_childContract).safeTransferFrom(address(this), _to, _childTokenId, _data);
        emit TransferChild(tokenId, _to, _childContract, _childTokenId);
    }

    function transferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external override {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0,
                "ComposableToken: tokenId || _childTokenId not found");
        require(tokenId == _fromTokenId, "ComposableToken: tokenId != _fromTokenId");
        require(_to != address(0), "ComposableToken: cannot be 0x");
        // address rootOwner = address(rootOwnerOf(tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
                rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender, "ComposableToken: sender is not the owner");
        removeChild(tokenId, _childContract, _childTokenId);
        //this is here to be compatible with cryptokitties and other old contracts that require being owner and approved
        // before transferring.
        //does not work with current standard which does not allow approving self, so we must let it fail in that case.
        //0x095ea7b3 == "approve(address,uint256)"
        bytes memory _calldata = abi.encodeWithSelector(0x095ea7b3, address(this), _childTokenId);
        assembly {
            let success := call(gas(), _childContract, 0, add(_calldata, 0x20), mload(_calldata), _calldata, 0)
        }
        ERC721(_childContract).transferFrom(address(this), _to, _childTokenId);
        emit TransferChild(tokenId, _to, _childContract, _childTokenId);
    }

    function transferChildToParent(uint256 _fromTokenId,
                                   address _toContract,
                                   uint256 _toTokenId,
                                   address _childContract,
                                   uint256 _childTokenId,
                                   bytes calldata _data) external override {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0,
                "ComposableToken: tokenId || _childTokenId not found");
        require(tokenId == _fromTokenId, "ComposableToken: tokenId != _fromTokenId");
        require(_toContract != address(0), "ComposableToken: cannot be 0x");
        // address rootOwner = address(rootOwnerOf(tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
            rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender, "ComposableToken: sender is not the owner");
        removeChild(_fromTokenId, _childContract, _childTokenId);
        ERC998ERC721BottomUp(_childContract).transferToParent(address(this), _toContract, _toTokenId, _childTokenId, _data);
        emit TransferChild(_fromTokenId, _toContract, _childContract, _childTokenId);
    }


    // this contract has to be approved first in _childContract
    function getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) external override {
        receiveChild(_from, _tokenId, _childContract, _childTokenId);
        require(_from == msg.sender ||
                ERC721(_childContract).isApprovedForAll(_from, msg.sender) ||
                ERC721(_childContract).getApproved(_childTokenId) == msg.sender,
                "ComposableToken: Sender not approved");
        ERC721(_childContract).transferFrom(_from, address(this), _childTokenId);

    }

    function onERC721Received(address _from, uint256 _childTokenId, bytes calldata _data) external returns (bytes4) {
        require(_data.length > 0, "ComposableToken: _data must contain the tokenId to transfer the child token");
        // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
        uint256 tokenId;
        assembly {tokenId := calldataload(132)}
        if (_data.length < 32) {
            tokenId = tokenId >> 256 - _data.length * 8;
        }
        receiveChild(_from, tokenId, msg.sender, _childTokenId);
        require(ERC721(msg.sender).ownerOf(_childTokenId) != address(0), "ComposableToken: Child token not owned.");
        return _ERC721_RECEIVED;
    }


    function onERC721Received(address _operator, address _from, uint256 _childTokenId, bytes calldata _data) external override returns (bytes4) {
        require(_data.length > 0, "_data must contain the uint256 tokenId to transfer the child token to.");
        // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
        uint256 tokenId;
        assembly {tokenId := calldataload(164)}
        if (_data.length < 32) {
            tokenId = tokenId >> 256 - _data.length * 8;
        }
        receiveChild(_from, tokenId, msg.sender, _childTokenId);
        require(ERC721(msg.sender).ownerOf(_childTokenId) != address(0), "ComposableToken: Child token not owned.");
        return _ERC721_RECEIVED;
    }


    function receiveChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) private {
        require(tokenIdToTokenOwner[_tokenId] != address(0), "ComposableToken: _tokenId does not exist.");
        require(childTokenIndex[_tokenId][_childContract][_childTokenId] == 0, "ComposableToken: Child token has already been received.");
        uint256 childTokensLength = childTokens[_tokenId][_childContract].length;
        if (childTokensLength == 0) {
            childContractIndex[_tokenId][_childContract] = childContracts[_tokenId].length;
            childContracts[_tokenId].push(_childContract);
        }
        childTokens[_tokenId][_childContract].push(_childTokenId);
        childTokenIndex[_tokenId][_childContract][_childTokenId] = childTokensLength + 1;
        childTokenOwner[_childContract][_childTokenId] = _tokenId;
        emit ReceivedChild(_from, _tokenId, _childContract, _childTokenId);
    }

    function _ownerOfChild(address _childContract,
                           uint256 _childTokenId) internal view returns (address parentTokenOwner, uint256 parentTokenId) {
        parentTokenId = childTokenOwner[_childContract][_childTokenId];
        require(parentTokenId > 0 || childTokenIndex[parentTokenId][_childContract][_childTokenId] > 0,
                "ComposableToken: No parentTokenId");
        return (tokenIdToTokenOwner[parentTokenId], parentTokenId);
    }

    function ownerOfChild(address _childContract,
                          uint256 _childTokenId) external view override returns (bytes32 parentTokenOwner, uint256 parentTokenId) {
        parentTokenId = childTokenOwner[_childContract][_childTokenId];
        require(parentTokenId > 0 || childTokenIndex[parentTokenId][_childContract][_childTokenId] > 0,
                "ComposableToken: No parentTokenId");
        // return (ERC998_MAGIC_VALUE << 224 | bytes32(tokenIdToTokenOwner[parentTokenId]), parentTokenId);
        return (ERC998_MAGIC_VALUE << 224 | bytes20(tokenIdToTokenOwner[parentTokenId]), parentTokenId);
    }

    function childExists(address _childContract, uint256 _childTokenId) external view returns (bool) {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        return childTokenIndex[tokenId][_childContract][_childTokenId] != 0;
    }

    function totalChildContracts(uint256 _tokenId) external view override returns (uint256) {
        return childContracts[_tokenId].length;
    }

    function childContractByIndex(uint256 _tokenId, uint256 _index) external view override returns (address childContract) {
        require(_index < childContracts[_tokenId].length, "Contract address does not exist for this token and index.");
        return childContracts[_tokenId][_index];
    }

    function totalChildTokens(uint256 _tokenId, address _childContract) external view override returns (uint256) {
        return childTokens[_tokenId][_childContract].length;
    }

    function childTokenByIndex(uint256 _tokenId, address _childContract, uint256 _index) external view override returns (uint256 childTokenId) {
        require(_index < childTokens[_tokenId][_childContract].length, "Token does not own a child token at contract address and index.");
        return childTokens[_tokenId][_childContract][_index];
    }

    ////////////////////////////////////////////////////////
    // ERC998ERC223 and ERC998ERC223Enumerable implementation
    ////////////////////////////////////////////////////////

    // tokenId => token contract
    mapping(uint256 => address[]) erc20Contracts;

    // tokenId => (token contract => token contract index)
    mapping(uint256 => mapping(address => uint256)) erc20ContractIndex;

    // tokenId => (token contract => balance)
    mapping(uint256 => mapping(address => uint256)) erc20Balances;

    function balanceOfERC20(uint256 _tokenId, address _erc20Contract) external view override returns (uint256) {
        return erc20Balances[_tokenId][_erc20Contract];
    }

    function removeERC20(uint256 _tokenId, address _erc20Contract, uint256 _value) private {
        if (_value == 0) {
            return;
        }
        uint256 erc20Balance = erc20Balances[_tokenId][_erc20Contract];
        require(erc20Balance >= _value, "ComposableToken: Not enough token available to transfer.");
        uint256 newERC20Balance = erc20Balance - _value;
        erc20Balances[_tokenId][_erc20Contract] = newERC20Balance;
        if (newERC20Balance == 0) {
            uint256 lastContractIndex = erc20Contracts[_tokenId].length - 1;
            address lastContract = erc20Contracts[_tokenId][lastContractIndex];
            if (_erc20Contract != lastContract) {
                uint256 contractIndex = erc20ContractIndex[_tokenId][_erc20Contract];
                erc20Contracts[_tokenId][contractIndex] = lastContract;
                erc20ContractIndex[_tokenId][lastContract] = contractIndex;
            }
            // erc20Contracts[_tokenId].length--;
            erc20Contracts[_tokenId].pop();
            delete erc20ContractIndex[_tokenId][_erc20Contract];
        }
    }


    function transferERC20(uint256 _tokenId, address _to, address _erc20Contract, uint256 _value) external override {
        require(_to != address(0), "ComposableToken: to can't be 0x");
        // address rootOwner = address(rootOwnerOf(_tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(_tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] == msg.sender, "ComposableToken: Sender is not the root owner");
        removeERC20(_tokenId, _erc20Contract, _value);
        require(ERC20AndERC223(_erc20Contract).transfer(_to, _value), "ComposableToken: ERC20 transfer failed.");
        emit TransferERC20(_tokenId, _to, _erc20Contract, _value);
    }

    // implementation of ERC 223
    function transferERC223(uint256 _tokenId, address _to, address _erc223Contract, uint256 _value, bytes calldata _data) external override {
        require(_to != address(0), "ComposableToken: to can't be 0x");
        // address rootOwner = address(rootOwnerOf(_tokenId));
        address rootOwner = address(bytes20(rootOwnerOf(_tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] == msg.sender, "ComposableToken: Sender is not the root owner");
        removeERC20(_tokenId, _erc223Contract, _value);
        require(ERC20AndERC223(_erc223Contract).transfer(_to, _value, _data), "ComposableToken: ERC223 transfer failed.");
        emit TransferERC20(_tokenId, _to, _erc223Contract, _value);
    }

    // this contract has to be approved first by _erc20Contract
    function getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) public override {
        bool allowed = _from == msg.sender;
        if (!allowed) {
            uint256 remaining;
            // 0xdd62ed3e == allowance(address,address)
            bytes memory _calldata = abi.encodeWithSelector(0xdd62ed3e, _from, msg.sender);
            bool callSuccess;
            assembly {
                callSuccess := staticcall(gas(), _erc20Contract, add(_calldata, 0x20), mload(_calldata), _calldata, 0x20)
                if callSuccess {
                    remaining := mload(_calldata)
                }
            }
            require(callSuccess, "ComposableToken: call to allowance failed");
            require(remaining >= _value, "ComposableToken: Value greater than remaining");
            allowed = true;
        }
        require(allowed, "ComposableToken: not allowed to getERC20");
        erc20Received(_from, _tokenId, _erc20Contract, _value);
        require(ERC20AndERC223(_erc20Contract).transferFrom(_from, address(this), _value), "ComposableToken: ERC20 transfer failed.");
    }

    function erc20Received(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) private {
        require(tokenIdToTokenOwner[_tokenId] != address(0), "ComposableToken: _tokenId does not exist.");
        if (_value == 0) {
            return;
        }
        uint256 erc20Balance = erc20Balances[_tokenId][_erc20Contract];
        if (erc20Balance == 0) {
            erc20ContractIndex[_tokenId][_erc20Contract] = erc20Contracts[_tokenId].length;
            erc20Contracts[_tokenId].push(_erc20Contract);
        }
        erc20Balances[_tokenId][_erc20Contract] += _value;
        emit ReceivedERC20(_from, _tokenId, _erc20Contract, _value);
    }

    // used by ERC 223
    function tokenFallback(address _from, uint256 _value, bytes calldata _data) external override {
        require(_data.length > 0, "ComposableToken: _data must contain the tokenId to transfer the token to.");
        require(address(msg.sender).isContract(), "ComposableToken: msg.sender is not a contract");
        /**************************************
        * TODO move to library
        **************************************/
        // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
        uint256 tokenId;
        assembly {
            tokenId := calldataload(132)
        }
        if (_data.length < 32) {
            tokenId = tokenId >> 256 - _data.length * 8;
        }
        //END TODO
        erc20Received(_from, tokenId, msg.sender, _value);
    }


    function erc20ContractByIndex(uint256 _tokenId, uint256 _index) external view override returns (address) {
        require(_index < erc20Contracts[_tokenId].length, "ComposableToken: Contract address does not exist for this token and index.");
        return erc20Contracts[_tokenId][_index];
    }

    function totalERC20Contracts(uint256 _tokenId) external view override returns (uint256) {
        return erc20Contracts[_tokenId].length;
    }
}