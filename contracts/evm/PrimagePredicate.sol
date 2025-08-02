// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title PreimagePredicate – Hashlock + Timelock predicate for 1inch LOP
contract PreimagePredicate {
    function check(
        bytes32 secretHash,
        uint256 expiry,
        bytes calldata preimage
    ) external view returns (bool) {
        if (block.timestamp > expiry) return false;
        return keccak256(preimage) == secretHash;
    }
}
