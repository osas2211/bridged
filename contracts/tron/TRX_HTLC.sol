// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title TRX_HTLC – Native‐TRX Hash‐Time‐Lock Contract
contract TRX_HTLC {
    struct Swap {
        address sender;
        address receiver;
        bytes32 secretHash;
        uint256 amount; // in sun (1 TRX = 1e6 sun)
        uint256 expiry; // UNIX timestamp
        bool refunded;
    }

    mapping(bytes32 => Swap) public swaps;

    event Locked(
        bytes32 indexed swapId,
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        bytes32 secretHash,
        uint256 expiry
    );
    event Claimed(bytes32 indexed swapId, bytes preimage, uint256 amount);
    event Refunded(bytes32 indexed swapId, uint256 amount);

    /// @notice Lock TRX into the contract under `swapId`
    function lock(
        bytes32 swapId,
        address receiver,
        bytes32 secretHash,
        uint256 expiry
    ) external payable {
        require(swaps[swapId].sender == address(0), "swap exists");
        require(expiry > block.timestamp, "expiry in past");
        require(msg.value > 0, "no TRX sent");

        swaps[swapId] = Swap({
            sender: msg.sender,
            receiver: receiver,
            secretHash: secretHash,
            amount: msg.value,
            expiry: expiry,
            refunded: false
        });

        emit Locked(
            swapId,
            msg.sender,
            receiver,
            msg.value,
            secretHash,
            expiry
        );
    }

    /// @notice Claim locked TRX by providing the correct `preimage`
    function claim(bytes32 swapId, bytes calldata preimage) external {
        Swap storage s = swaps[swapId];
        require(msg.sender == s.receiver, "not receiver");
        require(!s.refunded, "already refunded");
        require(block.timestamp <= s.expiry, "expired");
        require(keccak256(preimage) == s.secretHash, "invalid preimage");

        uint256 amount = s.amount;
        s.amount = 0;

        payable(s.receiver).transfer(amount);

        emit Claimed(swapId, preimage, amount);
    }

    /// @notice Refund your TRX after `expiry` if not yet claimed
    function refund(bytes32 swapId) external {
        Swap storage s = swaps[swapId];
        require(msg.sender == s.sender, "not sender");
        require(!s.refunded, "already refunded");
        require(block.timestamp > s.expiry, "not expired");

        s.refunded = true;
        uint256 amount = s.amount;
        s.amount = 0;

        payable(s.sender).transfer(amount);

        emit Refunded(swapId, amount);
    }
}
