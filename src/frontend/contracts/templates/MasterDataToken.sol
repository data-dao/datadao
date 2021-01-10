// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "../erc998/ComposableToken.sol";
import "../interfaces/ocean/IERC20Template.sol";
import "../interfaces/IMasterDataToken.sol";

// contract MasterDataToken is IMasterDataToken, ComposableToken {
    contract MasterDataToken is ERC721, IMasterDataToken {

    using SafeMath for uint256;

    string  private _name;
    string  private _symbol;
    string private _baseURI;
    address private _owner;
    bool private _initialized;

    address private _daoAddress;
    uint256 private _minDatatokenAllowance;
    uint256 private _totalRecords = 0;

    mapping(address => address[]) internal contributions;
    mapping(address => uint256) internal tokenToRecords;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "MasterDataToken: caller is not the owner");
        _;
    }

    constructor(string memory name,
                string memory symbol,
                string memory ipfsMetadata,
                uint256 minDataTokenAllowance,
                // address daoAddress) ComposableToken(name, symbol, "") public {
                address daoAddress) ERC721(name, symbol) public {

        _initialize(name, symbol, ipfsMetadata, minDataTokenAllowance, daoAddress);

    }

    function initialize(string calldata name,
                        string calldata symbol,
                        string calldata ipfsMetadata,
                        uint256 minDatatokenAllowance,
                        address daoAddress) external override returns (bool) {
        return _initialize(name, symbol, ipfsMetadata, minDatatokenAllowance, daoAddress);
    }

    function _initialize(string memory name,
                        string memory symbol,
                        string memory ipfsMetadata,
                        uint256 minDatatokenAllowance,
                        address daoAddress) private returns (bool) {

        require(minDatatokenAllowance != 0, "MasterDataToken: Min allowance must be greater than zero");

        if (address(daoAddress) != address(0)) {
            _owner = daoAddress;
        } else {
            _owner = _msgSender();
        }

        _name = name;
        _symbol = symbol;
        _minDatatokenAllowance = minDatatokenAllowance;
        _setBaseURI(ipfsMetadata);
        _initialized = true;
        return _initialized;
    }

    function contribute(address _datatoken, uint256 _records) external override returns (bool) {
        require(_records > 0, "MasterDataToken: records must be greater than zero");
        IERC20Template dataToken = IERC20Template(_datatoken);
        address tokenOwner = dataToken.minter();

        require(dataToken.allowance(tokenOwner, address(this)) >= _minDatatokenAllowance,
                "MasterDataToken: not enough allowance");
        require(dataToken.transferFrom(tokenOwner, address(this), _minDatatokenAllowance),
                "MasterDataToken: Failed to transfer datatoken liquidity");

        contributions[tokenOwner].push(_datatoken);
        tokenToRecords[_datatoken] = tokenToRecords[_datatoken].add(_records);
        _totalRecords.add(_records);

        emit ContributionAdded(tokenOwner, _datatoken, tokenToRecords[_datatoken]);

        return true;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    function isInitialized() external view override returns(bool) {
        return _initialized;
    }

    function totalRecords() external view override returns (uint256) {
        return _totalRecords;
    }
}