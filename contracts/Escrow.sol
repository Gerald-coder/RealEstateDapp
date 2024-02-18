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
    mapping(uint256 => mapping(address => bool)) public approved;

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

    // approve sale
    function approveSale(uint256 _nftID) public {
        approved[_nftID][msg.sender] = true;
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function updateInspectionStatus (uint256 _nftID, bool _passed) public onlyInspector {
        inspectionPassed[_nftID] = _passed;
    }


    /*
    1. require inspection status
    2. requires sales to be authorized
    3. required funds to be correct amount
    4. tranfer nft to buyer
    5. transfer funds to seller
    /*/
    function finalizeSales (uint256 _nftID) public {
        require(inspectionPassed[_nftID]);
        require(approved[_nftID][buyer[_nftID]]);
        require(approved[_nftID][seller]);
        require(approved[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);
        (bool success,) = payable(seller).call{value: address(this).balance}("");
        require(success);

        // transfer NFT from contract to the buyer
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);

    }
}
