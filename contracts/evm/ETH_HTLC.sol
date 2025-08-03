// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EthHTLC {
    struct Swap {
        address maker;
        address token;
        uint256 amount;
        bytes32 hashlock;
        uint256 timelock;
        bool withdrawn;
    }
    mapping(bytes32 => Swap) public swaps;

    event NewSwap(
        bytes32 indexed id,
        address indexed maker,
        address token,
        uint256 amount,
        bytes32 hashlock,
        uint256 timelock
    );
    event Withdraw(bytes32 indexed id, bytes32 preimage, address indexed to);
    event Refund(bytes32 indexed id);

    function newSwap(
        bytes32 id,
        address token,
        uint256 amount,
        bytes32 hashlock,
        uint256 timelock
    ) external {
        require(swaps[id].maker == address(0), "swap exists");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        swaps[id] = Swap(msg.sender, token, amount, hashlock, timelock, false);
        emit NewSwap(id, msg.sender, token, amount, hashlock, timelock);
    }

    function withdraw(bytes32 id, bytes32 preimage) external {
        Swap storage s = swaps[id];
        require(!s.withdrawn, "already withdrawn");
        require(
            sha256(abi.encodePacked(preimage)) == s.hashlock,
            "invalid preimage"
        );
        require(block.timestamp < s.timelock, "timelocked");
        s.withdrawn = true;
        IERC20(s.token).transfer(msg.sender, s.amount);
        emit Withdraw(id, preimage, msg.sender);
    }

    function refund(bytes32 id) external {
        Swap storage s = swaps[id];
        require(!s.withdrawn, "already withdrawn");
        require(block.timestamp >= s.timelock, "too early");
        s.withdrawn = true;
        IERC20(s.token).transfer(s.maker, s.amount);
        emit Refund(id);
    }
}
