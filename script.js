// -----  Creating Table for spreadsheet.  -------

const table = document.getElementById('resizeMe');
    
    let row = document.createElement('tr'); // First row 
    
    let img = document.createElement('img');  // Adding square img in top left cell
    img.setAttribute('id','select_table')
    img.src = './images/hollow_square.png';

    let col = document.createElement('th');   // cell created 
    col.appendChild(img);           // img added to the cell
    row.appendChild(col);           // cell | column added to the row as first cell.

    var initial = 65;       // 'A' ascii value
    var final = 91;         // 'Z' ascii value   
    let k = initial;        // variable to loop through and create header of the table

    for(let j=1;j<=26;j++,k++){    // 26 columns been created
        let column = document.createElement('th');   // 'th' element created
        // String.fromCharCode(k) - returns alphabets according to the ascii value.
        column.setAttribute('id',String.fromCharCode(k))  // id attribute is set  
        column.innerHTML = String.fromCharCode(k);      // header given the value as alphabets
        row.appendChild(column);
    }

    table.appendChild(row);     // First row is been added to the table

    for(let i=1;i<26;i++){      // 26 rows been created.
        let row = document.createElement('tr');     // 'tr' element is created.
        let sno = document.createElement('td');     // 'td' element is created.
        
        // String(i) - converts number to string.
        sno.setAttribute('id',String(i));       // id attribute is set according to the row no.
        sno.classList.add('sno');               // 'sno' classname added
        sno.innerHTML = i;                      // value set to i
        
        row.appendChild(sno);               // serial no. added as first element of the row
        
        k = initial;

        for(let j=1;j<=26;j++,k++){         // 26 columns
            let column = document.createElement('td');
            column.setAttribute('id',String.fromCharCode(k) + String(i))
            row.appendChild(column);        // column added to row.
        }

        table.appendChild(row);             // i'th row added to table
    }


//  -------  Resizing of the column.   --------

    document.addEventListener('DOMContentLoaded', function () {
    const createResizableTable = function (table) {
        const cols = table.querySelectorAll('th');

        [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer');

            // Set the height
            resizer.style.height = `${table.offsetHeight}px`;

            col.appendChild(resizer);

            createResizableColumn(col, resizer);
        });
    };

    const createResizableColumn = function (col, resizer) {
        let x = 0;
        let w = 0;

        const mouseDownHandler = function (e) {
            x = e.clientX;

            const styles = window.getComputedStyle(col);
            w = parseInt(styles.width, 10);

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            resizer.classList.add('resizing');
        };

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            col.style.width = `${w + dx}px`;
        };

        const mouseUpHandler = function () {
            resizer.classList.remove('resizing');
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        resizer.addEventListener('mousedown', mouseDownHandler);
    };

    createResizableTable(document.getElementById('resizeMe'));
});


    // splits string of alphanumeric into alphabets and numbers
    // and returns in form of array.

    function splitString(str){
        let alpha = "";
        let num = "";
        for (let i=0; i<str.length; i++){
            if (!isNaN(String(str[i]) * 1))
                num+=str[i];
            else if(str[i] >= 'A' && str[i] <= 'Z')
                alpha+=str[i];
        }
        return [alpha, num];
    }

    //  click event of the cells.

window.onclick = e => {
    const element = e.target;
    if(element.tagName !== "TD" | element.className === 'sno') return;   // selects only cells in table
    
    element.classList.add('clicked');   // when clicked add className as 'clicked'.
    
    element.innerHTML = "";             // cell value set to empty string
    
    const input = document.createElement("input");     // input element is created to take user input
    
    input.style.width = element.offsetWidth+'px';       // set textbox width equal to current elements width
    
    input.setAttribute('id','myInput');             // id set as 'myInput'
    input.setAttribute("type", "text");             // taking text/ string input     
    input.setAttribute("autocomplete","off");       // to avoid suggestions from previous inputs
    
    element.appendChild(input);             // text field added to the cell.

    const arr = splitString(element.id);    // element.id returns current elements id example - D14
                                            //  which can be further divided to get 'D' and '14'

    let columnName = document.getElementById(arr[0]);       // To get column header from id 
    let rowNumber = document.getElementById(arr[1]);        // To get row no. cell from id

    columnName.classList.add('clicked');        // className 'clicked' added to column header
    rowNumber.classList.add('clicked');         // className 'clicked' added to row no.| initial cell of the current row

    input.addEventListener("keypress", function(event) {    // Listening to the keyboard events.
        if (event.key === "Enter") {                // When enter is pressed.
            element.innerHTML = input.value;        // textbox value is added to the current cell
            element.classList.remove('clicked');        //  className 'clicked' removed from the current element
            columnName.classList.remove('clicked');     //  className 'clicked' removed from the header (th) element
            rowNumber.classList.remove('clicked');      //  className 'clicked' removed from the row no. cell of current row
        }
    });

} 

// -----   To download Table in form of CSV file -----

function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(html, filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
	
    for (var i = 1; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 1; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

document.querySelector("button").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
	export_table_to_csv(html, "table.csv");
});