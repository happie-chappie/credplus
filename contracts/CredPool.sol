pragma solidity ^0.7.0;
import "hardhat/console.sol";
import "./interfaces/IERC20.sol";

contract CredPool {
	// fixed interest rate
	uint interestRate = 5;

	// usdt address
	address public USDTAddress = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
	IERC20 public usdt = IERC20(USDTAddress);

    // An address type variable is used to store ethereum accounts.
    address public owner;

	constructor() {
        owner = msg.sender;
	}

	function deposit(uint amount) external returns (bool) {
		// console.log(address(this));
		// usdt.approve(address(this), amount);
		usdt.transferFrom(msg.sender, address(this), amount);
		console.log(amount);
		return true;
	}


}
