
// BUDGET CONTROLLER
var budgetController = (function(){

//EXPENSE CONSTRUCTOR
var Expense = function(id,description,value){
this.id=id;
this.description=description;
this.value=value;
this.percentage = -1;
}

Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
        this.percentage = Math.round((this.value /  totalIncome)*100);
    }else{
        this.percentage = -1;
    }
};

Expense.prototype.getPercentage = function(){
    return this.percentage;
}

//INCOME CONSTRUCTOR
var Income = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    }


var calculateTotal = function(type){
    var sum =0;
    data.allItems[type].forEach(function(e){
        sum+=e.value;
    });
    data.totals[type] = sum;        

}


    // STORE DATA
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }


    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            //CREATE NEW ID
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            else
                ID = 0;

            //CREATE ITEM BASED ON TYPE
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            // PUSH IT INTO ARRAY
            data.allItems[type].push(newItem);
            //RETURN NEW EL
            return newItem;
        },
        deleteItem: function(type,id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);
            if(index !== -1){
            data.allItems[type].splice(index,1);
            }
        },
        calculateBudget: function(){
                calculateTotal('exp');
                calculateTotal('inc');
                
                data.budget = data.totals.inc - data.totals.exp;
                if(data.totals.inc > 0){
                data.percentage =Math.floor (data.totals.exp / data.totals.inc * 100);}
                else{
                    data.percentage = -1;
                }                 
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(e){
                e.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPercentages = data.allItems.exp.map(function(e){
                return e.getPercentage();
            });
            return allPercentages;
        },
        getBudget: function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function(){console.log(data)}
    }






})();
//--------------------------------------------------------------------------------------------------------------------------

// UICONTROLER
var UIController = (function(){
    // DOM LIST NAMES
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    var formatNumber = function(num,type){
        var numSplit, int , dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];  
        dec = numSplit[1];

        int1="";    //FORMAT NUM 

        if(int.length % 3 === 0 && int.length > 3){
                int1+=int.substring(0,3);
                for(var i =3;i<int.length;i+=3){
                    int1+= ',' + int.slice(i,i+3);
        }
        }else if(int.length % 3 === 1 && int.length > 3){
            int1+=int.substring(0,1);
                for(var i=1 ;i<int.length;i+=3){
                    int1 += ',' + int.slice(i,i+3);
        }}else if(int.length % 3 === 2 && int.length > 3){
            int1+=int.substring(0,2);
                for(var i =2;i<int.length;i+=3){
                    int1+= ',' + int.slice(i,i+3);
        }}else{
            int1+= int;
        }


        return (type === 'exp' ? '-' : '+') + ' ' + int1 + '.' + dec;


    }

    var nodeListForEach = function (list, callback){
        for(var i = 0;i< list.length;i++){
            callback(list[i],i);
        }
    };



    // RETURNING PUBLIC METHODS
return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function(obj,type){
            var html, newHtml,element;
                        // WRITING HTML FOR PRESENTING EXPENSE OR INCOME
                        if(type === 'inc'){
                            element = DOMstrings.incomeContainer;
                        html = '<div class="item clearfix" id="inc-%id%">'
                            html +='<div class="item__description">%description%</div>'
                            html +='<div class="right clearfix">'
                                html +='<div class="item__value">%value%</div>'
                                html +='<div class="item__delete">'
                                    html+='<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                        
                        }
                        else if(type === 'exp'){
                            element = DOMstrings.expensesContainer;
                        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">'
                        html += '<div class="item__value">%value%</div>'
                        html +=     '<div class="item__percentage">21%</div>'
                        html +=        '<div class="item__delete">'
                        html +=            '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                        }

                        newHtml = html.replace('%id%',obj.id).replace('%description%',obj.description).replace('%value%',formatNumber(obj.value,type));

                        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml); //adding item as a list child of selected element
        },
        clearFields: function(){
                var fields;

                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

                fieldsArr = Array.prototype.slice.call(fields);

                fieldsArr.forEach(function(e){
                    e.value = ""
                });

                fieldsArr[0].focus();
        },
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        displayBudget: function(obj){
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            if(obj.percentage > 0)
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            else
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);


            nodeListForEach(fields, function(current, index){
                if(percentages[index]>0)
                current.textContent = percentages[index] + '%';
                else
                    current.textContent = '---';
            });


        },
        displayMonth: function(){
            var now,months,month,year;

            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year; 

        },
        changedType:function(){
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(fields,function(e){
                e.classList.toggle('red-focus');
            })

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },
        getDOMstrings: function(){
            return DOMstrings;
        }

    }

})();
//---------------------------------------------------------------------------------------------------------------------------------------

// CONTROLER
var controller = (function(budgetCtrl,UICtrl){

    //SET UP EVENT LISTENERS
    var setUpEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();


        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);



        document.addEventListener('keypress',function(event){
        if(event.code === 13 || event.which === 13){
            ctrlAddItem();
        }
        });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem); // Event bubling catch

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    }

    var updateBudget = function(){

        //1 calculate the budget
        budgetCtrl.calculateBudget();

        //2 return budget
        var budget = budgetCtrl.getBudget();

        //3 display the budget on UI
        UICtrl.displayBudget(budget);
    }
    

    var updatePercentages = function(){
        //1. Calculate percentages
            budgetCtrl.calculatePercentages();
        //2. Read percentages from budget controller
            var percentages = budgetCtrl.getPercentages();
        //3. Update UI with new percentages
           UICtrl.displayPercentages(percentages);
    }


    var ctrlAddItem = function(){
            //1 get input data
            var input = UICtrl.getInput();
            console.log(input);
            if(input.description.trim() !== "" && !isNaN(input.value) && input.value > 0 ){
                console.log(input.description.trim().length);
            //2 add item to the budget controler
            var newItem = budgetController.addItem(input.type,input.description,input.value); // input recived obj from getInput from ui
            //3 add item to UI
            UICtrl.addListItem(newItem, input.type);
            //4 clear fields
            UICtrl.clearFields();

            //5 budget calc display
            updateBudget();

            //6 calc and update percentages
            updatePercentages();
            }

    }

    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;  //event delegation (only element with id)

        if(itemID){
            splitID = itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            
            //1 delete from data struct
            budgetCtrl.deleteItem(type,ID);
            //2 delete from UI
            UICtrl.deleteListItem(itemID);
            //3 update and show budget
            updateBudget();
            //4 calc and update percentages
            updatePercentages();
        }

    }


    //RETURNING INIT METHOD
return {
    init: function(){
        console.log('app has started');
        UICtrl.displayMonth();
        UICtrl.displayBudget({
            budget:0,
            totalInc:0,
            totalExp:0,
            percentage:-1
        });
        setUpEventListeners();
    }
}

})(budgetController,UIController);

// CALLING INIT TO SET UP LISTENERS
controller.init();



