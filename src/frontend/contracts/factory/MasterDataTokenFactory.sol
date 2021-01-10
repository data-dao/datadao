// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./Deployer.sol";
import "../interfaces/IMasterDataToken.sol";

/**
 * @title MasterDataTokenFactory contract
 * @author
 *
 * @dev Implementation of NFTMarket Factory
 *
 *      MasterDataTokenFactory deploys A MasterDataToken proxy contracts.
 *      Proxy contract functionality is based on the ERC1167 standard
 *      https://eips.ethereum.org/EIPS/eip-1167
 */
contract MasterDataTokenFactory is Context, Deployer {

    using SafeMath for uint256;
    using Address for address;

    address private _template;

    uint256 private dataTokenCount = 1;

    mapping(address => address) private daoToToken;

    event MasterDataTokenCreated(address indexed tokenAddress,
                                 address indexed owner,
                                 address indexed daoAddress,
                                 string ipfsMetadata,
                                 uint256 minDatatokenAllowance,
                                 address templateAddress);

    constructor(address template) public {
        require(template != address(0) && template.isContract(), 'MasterDataTokenFactory: Invalid contract template');
        _template = template;
    }

    function getMasterDataTokenCount() external view returns (uint256) {
        return dataTokenCount;
    }

    function getTemplate() external view returns (address) {
        return address(_template);
    }

    function createMasterDataToken(string calldata _name,
                                   string calldata _symbol,
                                   string calldata _ipfsMetadata,
                                   uint256 _minDatatokenAllowance,
                                   address _daoAddress) public returns (address dataToken) {

        address owner = _msgSender();
        dataToken = deploy(_template);

        IMasterDataToken masterDataToken = IMasterDataToken(dataToken);

        require(masterDataToken.initialize(
            _name,
            _symbol,
            _ipfsMetadata,
            _minDatatokenAllowance,
            _daoAddress
        ), "MasterDataTokenFactory: Failed to initialize a new MasterDataToken instance");

        if (_daoAddress != address(0)) {
            daoToToken[_daoAddress] = dataToken;
        }

        emit MasterDataTokenCreated(
            dataToken,
            owner,
            _daoAddress,
            _ipfsMetadata,
            _minDatatokenAllowance,
            _template);

        dataTokenCount.add(1);
        return dataToken;
    }

    function dataDaoToken(address daoAddress) external view returns (address) {
        return daoToToken[daoAddress];
    }

}