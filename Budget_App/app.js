
//BUDGET CONTROLLER -------------------------------------------------------
var budgetController=(function()
{
    var expense=function(id,des,value)
    {
        this.id=id;
        this.des=des;
        this.value=value;
        this.percentage=-1;
    };

    expense.prototype.calcPercentage=function(totalincome)
    {
        if (totalincome>0)
            this.percentage=Math.round((this.value/totalincome)*100);
        else
            this.percentage=-1;
    }

    expense.prototype.getpercentage=function()
    {
        return this.percentage;
    }

    var income=function(id,des,value)
    {
        this.id=id;
        this.des=des;
        this.value=value;
    };

    var data={
        allitems: {
            exp: [],
            inc: []
        },

        totalitems: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

    };

    var sumCalc=function(type)
    {
        sum=0;
        for (var i=0;i<data.allitems[type].length;i++)
        {
            sum += data.allitems[type][i].value;
        }

        data.totalitems[type]=sum;

    }

    return {
        
        
        addNewItem: function(type, des, val)
        {   var newItem, ID;
            
            if(data.allitems[type].length===0)
            ID=0;
            else
            ID=data.allitems[type][data.allitems[type].length-1].id +1;
            
            if(type==='exp')
            {
                newItem=new expense(ID,des,val);
            }

            else if(type==='inc')
            {
                newItem=new income(ID,des,val);
            }

            data.allitems[type].push(newItem);
            return newItem;
        },
        
        
        totalSumCalc: function()
        {
            sumCalc('exp');
            sumCalc('inc');

            data.budget=data.totalitems.inc-data.totalitems.exp;
            
            if (data.totalitems.inc>0)
            data.percentage=Math.round((data.totalitems.exp/data.totalitems.inc)*100);

            else
            data.percentage=-1;

        },

        getBudget: function()
        {
            return {
                budget: data.budget,
                totalincome: data.totalitems.inc,
                totalexpense: data.totalitems.exp,
                percentage: data.percentage
            }
        },
        

        deleteItem: function(type,id)
        {   
            var ids;
            ids=data.allitems[type].map(function(current){
                return current.id;
            });

            var index=ids.indexOf(id);
            if (index!==-1)
            {
                data.allitems[type].splice(index,1);
            }
        },

        calculatePercentage: function()
        {
            data.allitems.exp.forEach(function(current)
            {
                current.calcPercentage(data.totalitems.inc);
            });
            
        },
        getPer: function()
        {
            var allper=data.allitems.exp.map(function(current){
                return current.getpercentage();
            });

            return allper;
        },
        
        
        testing: function()
        {
            console.log(data);
        }
    };



})();




//UI CONTROLLER--------------------------------------------------------


var UIController=(function()
{
    DOMStrings={
        inputType:'.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        clickButton: '.add__btn',
        expenseContainer: '.expenses__list',
        incomeContainer: '.income__list',
        budgetContainer: '.budget__value',
        totalIncContainer: '.budget__income--value',
        totalExpContainer: '.budget__expenses--value',
        percentageContainer: '.budget__expenses--percentage',
        deleteContainer: '.container',
        percentageExpLabel:'.item__percentage',
        dateLabel: '.budget__title--month'
                       
    };

    formatNumber= function(num,type){
        var num,numSplit,int;
        num=Math.abs(num);
        num=num.toFixed(2);

        numSplit=num.split('.');
        int=numSplit[0];

        if (int.length>9)
        {   int=int.substr(0,int.length-9)+','+int.substr(int.length-9,3)+','+int.substr(int.length-6,3)+','+int.substr(int.length-3,3);
       
        }
        
        else if (int.length>6)
         {   int=int.substr(0,int.length-6)+','+int.substr(int.length-6,3)+','+int.substr(int.length-3,3);
        
         }

        else if (int.length>3) 
        {
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            
        }

        

        dec=numSplit[1];

        return (type==='exp' ? '-':'+')+''+int+'.'+dec;
    }

    nodeForEach=function(list,callback)
            {
                for (var i=0;i<list.length;i++)
                {
                    callback(list[i],i);
                }
            }


    return {
        
        
        getInputData: function()
        {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                inputText: document.querySelector(DOMStrings.inputDescription).value,
                inputNumber: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        
        getDom: function(){
            return DOMStrings;
        },

        
        addListItem: function(obj,type)
        {
            var html,newhtml,element;
            if (type==='inc')
            {
                element=DOMStrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            else if (type==='exp')
            {   element=DOMStrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%des%',obj.des);
            newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },

        
        clearList: function(){
            var fields,fieldArr;
            fields=document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
            fieldArr=Array.prototype.slice.call(fields);
            
            for (var i=0;i<fieldArr.length;i++)
            {
                fieldArr[i].value="";
            }

            fieldArr[0].focus();
        },


        updateBudgetUI: function(obj){
            var type;
            obj.budget<0? type='exp':type='inc';
            
            document.querySelector(DOMStrings.budgetContainer).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.totalIncContainer).textContent=formatNumber(obj.totalincome,'inc');
            document.querySelector(DOMStrings.totalExpContainer).textContent=formatNumber(obj.totalexpense,'exp');
            
            
            if (obj.percentage>0)
            {
                document.querySelector(DOMStrings.percentageContainer).textContent=obj.percentage+'%';
            }

            else{
                document.querySelector(DOMStrings.percentageContainer).textContent='---';
            }
        },

        deleteListItem: function(listID)
        {
            var ele=document.getElementById(listID);
            ele.parentNode.removeChild(ele);

        },

        displayPercentage: function(percentage)
        {
            var fields=document.querySelectorAll(DOMStrings.percentageExpLabel);

            

            nodeForEach(fields,function(current,index)
            {
                if(percentage[index]>0)
                    current.textContent=percentage[index]+'%';
                
                else
                    current.textContent='---';
            })
        },

        displayMonth: function()
        {
            var now,year,month;
            var months='January,Febuary,March,April,May,June,July,August,September,October,November,December';
            months=months.split(',');
            now=new Date();
            year=now.getFullYear();
            month=now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent=months[month]+' '+year;
        },


        changeColor: function()
        { 
            var fields=document.querySelectorAll(
            DOMStrings.inputType+','+DOMStrings.inputDescription+','+DOMStrings.inputValue
            );

            nodeForEach(fields,function(current)
            {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.clickButton).classList.toggle('red');

        }

        
    };

})();



// GLOBAL APP CONTROLLER-------------------------------------------------------------------


var Controller=(function(BudgetCon,UICon)
{   
    var setupEvent=function()
    {       
        var DOM=UICon.getDom();

        document.querySelector(DOM.clickButton).addEventListener('click', enterInput);

        document.addEventListener('keypress',function(event){
            if (event.keyCode ===13 || event.which===13) 
                {
                    enterInput();
                }
          
        });
        

        document.querySelector(DOM.deleteContainer).addEventListener('click',deleteEvent);

        document.querySelector(DOM.inputType).addEventListener('change',UICon.changeColor);

    };

    var updateBudget=function()
    {
        BudgetCon.totalSumCalc();

        var budget=BudgetCon.getBudget();

        UICon.updateBudgetUI(budget);


    }

    var enterInput=function()
    {
        var inputData=UICon.getInputData();

        if(inputData.inputDescription !== "" && inputData.inputValue !== NaN && inputData.inputNumber >0)
        {
        var display=BudgetCon.addNewItem(inputData.type,inputData.inputText,inputData.inputNumber);

        UICon.addListItem(display,inputData.type);

        UICon.clearList();

        updateBudget();

        updatePercentage();

        }

    };


    var deleteEvent=function(event){
        var itemID,type,splitID,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID)
        {
            splitID=itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            

            BudgetCon.deleteItem(type,ID);

            UICon.deleteListItem(itemID);

            updateBudget();

            updatePercentage();


        }


    }

    var updatePercentage=function()
    {
        BudgetCon.calculatePercentage();

        var percentage=BudgetCon.getPer();

        UICon.displayPercentage(percentage);
    }


    
      
    return {
        init: function()
        {
            console.log('Application Has Started');
            UICon.updateBudgetUI({
                budget: 0,
                totalincome: 0,
                totalexpense: 0,
                percentage: 0
            });

            UICon.displayMonth();
            return setupEvent();
        }

    };

})(budgetController,UIController);



//General -----------------------------------------------------------------------
Controller.init();


