//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public lender;
    address payable public seller ;
    address public nftAddress;
    address public inspector;


    mapping(uint256 => bool) public isListing;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;

    modifier onlySeller () {
        require(msg.sender == seller, "only seller can call this method");
        _;
    }

    modifier onlyBuyer (uint256 _nftID){
        require(msg.sender == buyer[_nftID], "only the buyer can call this function");
        _;
    }

    modifier onlyInspector () {
        require(msg.sender == inspector, "only the inspector can call this function");
        _;
    }

    constructor ( address _ntfAddress, address payable _seller, address _inspector,address _lender ){
        lender = _lender;
        seller = _seller;
        nftAddress = _ntfAddress;
        inspector = _inspector;
    }

    function List (uint256 _nftID, uint256 _purchasePrice, uint256 _escrowAmount, address _buyer) payable onlySeller public {
    // transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        isListing[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    function depositEarnest (uint256 _nftID) payable public onlyBuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID], "not enough ether for purchase, gerrry");
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function updateInspectionStatus (uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed;
    }
}
