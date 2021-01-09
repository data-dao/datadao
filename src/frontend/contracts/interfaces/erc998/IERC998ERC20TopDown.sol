// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;


interface IERC998ERC20TopDown {
    event ReceivedERC20(address indexed _from, uint256 indexed _tokenId, address indexed _erc20Contract, uint256 _value);
    event TransferERC20(uint256 indexed _tokenId, address indexed _to, address indexed _erc20Contract, uint256 _value);

    function tokenFallback(address _from, uint256 _value, bytes calldata _data) external;
    function balanceOfERC20(uint256 _tokenId, address __erc20Contract) external view returns (uint256);
    function transferERC20(uint256 _tokenId, address _to, address _erc20Contract, uint256 _value) external;
    function transferERC223(uint256 _tokenId, address _to, address _erc223Contract, uint256 _value, bytes calldata _data) external;
    function getERC20(address _from, uint256 _tokenId, address _erc20Contract, uint256 _value) external;

}

interface ERC998ERC20TopDownEnumerable {
    function totalERC20Contracts(uint256 _tokenId) external view returns (uint256);
    function erc20ContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address);
}

interface ERC20AndERC223 {
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);
    function transfer(address to, uint value) external returns (bool success);
    function transfer(address to, uint value, bytes calldata data) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
}