// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

interface ERC998ERC721BottomUp {
    function transferToParent(address _from, address _toContract, uint256 _toTokenId, uint256 _tokenId, bytes calldata _data) external;
}