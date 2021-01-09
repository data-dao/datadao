
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

contract TestContract {
    address public manager;
    address payable[] public example;

    constructor() public {
        manager = msg.sender;
    }

    function newStorage(address payable _exampleAddress) public {
        example.push(_exampleAddress);
    }

    function getexample() public view returns (address payable[] memory) {
        return example;
    }

    function deleteStorage(uint256 _exampleIndex) public {
        require(msg.sender == manager, 'You are not authorized');
        delete example[_exampleIndex];
    }
}
