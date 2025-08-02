// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestERC20 {
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

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _transfer(address from, address to, uint256 amt) internal {
        require(balanceOf[from] >= amt, "bal");
        balanceOf[from] -= amt;
        balanceOf[to] += amt;
        emit Transfer(from, to, amt);
    }

    function transfer(address to, uint256 amt) external returns (bool) {
        _transfer(msg.sender, to, amt);
        return true;
    }

    function approve(address sp, uint256 amt) external returns (bool) {
        allowance[msg.sender][sp] = amt;
        emit Approval(msg.sender, sp, amt);
        return true;
    }

    function transferFrom(
        address f,
        address t,
        uint256 a
    ) external returns (bool) {
        uint256 al = allowance[f][msg.sender];
        require(al >= a, "allow");
        if (al != type(uint256).max) {
            allowance[f][msg.sender] = al - a;
        }
        _transfer(f, t, a);
        return true;
    }
}
