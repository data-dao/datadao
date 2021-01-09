// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

interface IMasterDataToken {

    event ContributionAdded(address indexed contributor, address indexed dataToken, uint256 records);

    function initialize(string calldata _name,
                        string calldata _symbol,
                        string calldata _ipfsMetadata,
                        uint256 _minDatatokenAllowance,
                        address _daoAddress) external returns (bool);

    function contribute(address _datatoken, uint256 _records) external returns (bool);

    function isInitialized() external view returns (bool);

    function totalRecords() external view returns (uint256);

    // function buy() external;

}