// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestTRC20 {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(string memory _n, string memory _s, uint8 _d, uint256 _supply) {
        name = _n;
        symbol = _s;
        decimals = _d;
        _mint(msg.sender, _supply);
    }

    function _mint(address to, uint256 amt) internal {
        totalSupply += amt;
        balanceOf[to] += amt;
        emit Transfer(address(0), to, amt);
    }

    function _transfer(
        address from_address,
        address to_address,
        uint256 amount
    ) internal {
        require(balanceOf[from_address] >= amount, "low balance");
        balanceOf[from_address] -= amount;
        balanceOf[to_address] += amount;
        emit Transfer(from_address, to_address, amount);
    }

    function transfer(address to_address, uint256 a) external returns (bool) {
        _transfer(msg.sender, to_address, a);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from_address,
        address to_address,
        uint256 a
    ) external returns (bool) {
        uint256 al = allowance[from_address][msg.sender];
        require(al >= a, "al");
        if (al != type(uint256).max) {
            allowance[from_address][msg.sender] = al - a;
        }
        _transfer(from_address, to_address, a);
        return true;
    }
}
