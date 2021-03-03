//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
import "hardhat/console.sol";
import "./interfaces/IERC20.sol";

contract CredPoolV1 {
	// fixed interest rate
	uint interestRate = 5;

	// dai address
	address public DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
	IERC20 public dai = IERC20(DAI_ADDRESS);

    // An address type variable is used to store ethereum accounts.
    address public owner;

	constructor() {
        owner = msg.sender;
	}

	function deposit(uint amount) external returns (bool) {
		// console.log(address(this));
		// usdt.approve(address(this), amount);
		dai.transferFrom(msg.sender, address(this), amount);
		console.log(amount);
		return true;
	}
}
