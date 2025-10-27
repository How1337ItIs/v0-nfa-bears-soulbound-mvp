// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";
import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";

/**
 * @title NFA Bears Genesis Collection
 * @notice 710 unique Genesis Bears with discount code functionality
 * @dev Extends Thirdweb's ERC721Drop for gasless claiming and marketplace compatibility
 */
contract NFABearsGenesis is ERC721Drop, PermissionsEnumerable {

    // Constants
    uint256 public constant MAX_SUPPLY = 710;
    uint256 public constant BASE_PRICE = 333 ether; // 333 BERA
    uint256 public constant MAX_PER_WALLET = 5;
    uint256 public constant MAX_PER_TX = 3;

    // Discount system
    mapping(bytes32 => uint256) public discountPercents; // code hash => discount %
    mapping(address => bool) public hasUsedDiscount;
    mapping(address => uint256) public mintedPerWallet;

    // Events
    event DiscountCodeAdded(string code, uint256 percent);
    event DiscountCodeRemoved(string code);
    event Minted(address indexed minter, uint256 quantity, uint256 pricePaid, string discountCode);

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Drop(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Mint Genesis Bears with optional discount code
     * @param _receiver Address to receive the NFTs
     * @param _quantity Number of NFTs to mint (1-3)
     * @param _discountCode Optional discount code string
     */
    function claim(
        address _receiver,
        uint256 _quantity,
        string memory _discountCode
    ) public payable {
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Max supply reached");
        require(_quantity > 0 && _quantity <= MAX_PER_TX, "Invalid quantity");
        require(mintedPerWallet[_receiver] + _quantity <= MAX_PER_WALLET, "Exceeds wallet limit");

        uint256 totalPrice = BASE_PRICE * _quantity;
        bytes32 codeHash = keccak256(abi.encodePacked(_discountCode));

        // Apply discount if valid and unused
        if (discountPercents[codeHash] > 0 && !hasUsedDiscount[_receiver]) {
            uint256 discount = discountPercents[codeHash];
            totalPrice = (totalPrice * (100 - discount)) / 100;
            hasUsedDiscount[_receiver] = true;
        }

        require(msg.value >= totalPrice, "Insufficient payment");

        // Mint tokens
        for (uint256 i = 0; i < _quantity; i++) {
            uint256 tokenId = totalSupply();
            _mint(_receiver, tokenId);
        }

        mintedPerWallet[_receiver] += _quantity;

        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit Minted(_receiver, _quantity, totalPrice, _discountCode);
    }

    /**
     * @notice Add a discount code (admin only)
     * @param _code Discount code string (case-insensitive)
     * @param _percent Discount percentage (1-100)
     */
    function addDiscountCode(string memory _code, uint256 _percent)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_percent > 0 && _percent <= 100, "Invalid discount percent");
        bytes32 codeHash = keccak256(abi.encodePacked(_code));
        discountPercents[codeHash] = _percent;
        emit DiscountCodeAdded(_code, _percent);
    }

    /**
     * @notice Remove a discount code (admin only)
     * @param _code Discount code string to remove
     */
    function removeDiscountCode(string memory _code)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        bytes32 codeHash = keccak256(abi.encodePacked(_code));
        delete discountPercents[codeHash];
        emit DiscountCodeRemoved(_code);
    }

    /**
     * @notice Check if a discount code is valid
     * @param _code Discount code to check
     * @return percent The discount percentage (0 if invalid)
     */
    function checkDiscountCode(string memory _code)
        external
        view
        returns (uint256 percent)
    {
        bytes32 codeHash = keccak256(abi.encodePacked(_code));
        return discountPercents[codeHash];
    }

    /**
     * @notice Check if an address has used a discount
     * @param _address Address to check
     * @return Whether the address has used a discount
     */
    function hasUsedDiscountCode(address _address)
        external
        view
        returns (bool)
    {
        return hasUsedDiscount[_address];
    }

    /**
     * @notice Withdraw contract balance (admin only)
     */
    function withdraw()
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(msg.sender).transfer(balance);
    }

    /**
     * @notice Get current mint statistics
     * @return minted Total number minted
     * @return remaining Number remaining
     * @return price Current base price in wei
     */
    function getMintStats()
        external
        view
        returns (
            uint256 minted,
            uint256 remaining,
            uint256 price
        )
    {
        minted = totalSupply();
        remaining = MAX_SUPPLY - minted;
        price = BASE_PRICE;
    }
}
