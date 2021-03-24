//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./dependencies/ERC20.sol";

// TODO: have to adhere to ICToken
contract CTokenV2 is ERC20 {
	uint public INITIAL_SUPPLY = 330000;
	address public POOL_ADDRESS;

	constructor(address _pool_address) ERC20("CTokenV2", "CT") {
		POOL_ADDRESS = _pool_address;
	  	_mint(POOL_ADDRESS, INITIAL_SUPPLY);
	}

	function mint(address _owner, uint amount) public returns (bool) {
	  	_mint(_owner, amount);
		return true;
	}

	function burn(address _owner, uint amount) public returns (bool) {
	  	_burn(_owner, amount);
		return true;
	}
}
