//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./dependencies/ERC20.sol";

contract CToken is ERC20 {
	uint public INITIAL_SUPPLY = 330000;
	address public new_owner;

	constructor(address _owner) ERC20("CToken", "CT") {
		new_owner = _owner;
	  	_mint(_owner, INITIAL_SUPPLY);
	}
}
