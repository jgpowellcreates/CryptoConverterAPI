let listURL = "http://api.coinlayer.com/api/list";
let accessKey = "?access_key=495de5b617fbffee3c1f1985616ed1fa";

let rateURL = "http://api.coinlayer.com/api/live"

//Dropdown Button / Input Options
/////////////////////////////////
const cryptoKey = document.getElementById("cryptoKey");
const fiatKey = document.getElementById("fiatKey");
const qtyKey = document.getElementById("qtyKey");

let cryptoArr = {};

const qtyInput = '';
const cryptoInput = '';
const fiatInput = '';

const convertBtn = document.getElementById("convertBtn");

// OUTPUT / FIELDS POPULATED BY CONVERSION FUNCTION
////////////////////////////////////////////////////
// The Vars for Currency Abbreviations are defined later w/ dropdown interaction
////////////////////////////////////////////////////
const leftCol = document.querySelector(".leftCol");
const cryptoIcon = document.getElementById("cryptoIcon");

const rightCol = document.querySelector(".rightCol");
const fiatIcon = document.getElementById("fiatIcon");

let rateAlert = document.getElementById("rateAlert");
let atRateAlert = document.getElementById("atRateAlert");

//This function fetches at start to pull currency symbol/types in to dropdown lists
//It stays running so that function submitForRate can call back to ref crypto icons
/////////////////////////////////////////////////////
function startPage() {
fetch(listURL + accessKey)
.then(function(results) {
    return results.json();
})
.then(function(data) {
    loadList(data);
});

    function loadList (data) {
        console.log(data);
    for (syms in data.crypto) {
        let option = document.createElement("option");
        let node = document.createTextNode(data.crypto[syms].name);
        option.value = data.crypto[syms].name;
        option.appendChild(node);
        cryptoKey.appendChild(option);
    }

    for (currs in data.fiat) {
        let option = document.createElement("option");
        let node = document.createTextNode(data.fiat[currs]);
        option.value = data.fiat[currs];
        option.appendChild(node);
        fiatKey.appendChild(option);
    }

    // POPULATING DIVS ON DROPDOWN SELECTIONS
    ///////////////////////////////////////////
    let changedCryptoText = document.getElementById("cryptoChange");
    function listCryptoType() {
        //console.log(this.value);
        for (syms in data.crypto) {
            if (`${data.crypto[syms].name}` == this.value){
                changedCryptoText.textContent = syms;   
            }
        }
    }
    document.getElementById("cryptoKey").onchange = listCryptoType;
    //
    let changedFiatText = document.getElementById("fiatChange");
    function listFiatType() {
        for (titles in data.fiat) {
            if (`${data.fiat[titles]}` == this.value){
                changedFiatText.textContent = titles;   
            }
        }
    }
    document.getElementById("fiatKey").onchange = listFiatType;
    ////////////////////////////////////////////
    ////////////////////////////////////////////


    convertBtn.addEventListener("click", e => submitForRate(data));
    // CLICK CONVERT TO FETCH CUSTOM URL - READS VALUES FROM DROPDOWNS
    /////////////////////////////////////////////////////////////////

    function submitForRate (data) {
        //console.log(changedFiatText.innerText, changedCryptoText.textContent);

        let qtyInput = qtyKey.value;
        let cryptoInput = changedCryptoText.textContent;
        let fiatInput = changedFiatText.innerText;

        //console.log(qtyInput, cryptoInput, fiatInput);
        fetch(rateURL + accessKey + `&target=${fiatInput}&symbols=${cryptoInput}`)
        .then(function(results) {
            return results.json();
        })
        .then(function(rateData) {
            popConvert(rateData);
        })

        function popConvert (rateData) {
            //Producing Conversion 
            console.log(rateData);
            let rate = rateData.rates[`${cryptoInput}`]; //LOOKING UP THE RATE BY DROPDOWN VALUE
            console.log(rate);

            let conversion = (qtyInput * rate).toFixed(2); //RETURN ROUNDED NUMBER
            console.log(conversion);

            // COLORIZE DIVS
            leftCol.style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(251, 249, 76, 0.73))";
            rightCol.style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(108, 233, 227, 0.73))";

            //Populating Results - Images
            cryptoIcon.style.background = `url(${data.crypto[`${cryptoInput}`].icon_url}) no-repeat center`;
            cryptoIcon.style.backgroundSize = "contain";
            cryptoIcon.style.borderRadius = "10px";
            console.log(data.crypto[`${cryptoInput}`].icon_url);

            fiatIcon.style.background = `url("assets/coins.png") no-repeat center`;
            fiatIcon.style.backgroundSize = "contain";

            //Populating Results - Text -> w/ while function to remove previous convert info
            //Pulling Qty input
            while (cryptoIcon.firstChild) {
                cryptoIcon.removeChild(cryptoIcon.firstChild);
            }
            let cryptoAmt = document.createElement("h3");
            cryptoAmt.setAttribute("class","convertAmt");
            cryptoAmt.innerText = qtyInput;
            cryptoIcon.appendChild(cryptoAmt);
            //Returning Conversion Amt from earlier in popConvert!
            while (fiatIcon.firstChild) {
                fiatIcon.removeChild(fiatIcon.firstChild);
            }
            let fiatAmt = document.createElement("h3");
            fiatAmt.setAttribute("class","convertAmt");
            fiatAmt.innerText = conversion;
            fiatIcon.appendChild(fiatAmt);
            
            //Rate Declaration
            rateAlert.innerText = `${cryptoInput}'s current rate is ${rate.toFixed(5)}`;
            atRateAlert.innerText = `Your ${qtyInput} ${cryptoInput} are worth ${conversion} ${fiatInput}s.`

        }
    }
    
}
}

startPage();


