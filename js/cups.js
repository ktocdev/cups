jQuery(function ($) {
	var Cups = {
		init: function () {
			var goal = 0;
			this.build();
			this.click();
		},

		_fill: function(cup,amount){
			$(cup).find('.fill').height(amount + 'em').html('<p>' + amount + '</p>');
			if (amount == 0){
				$(cup).addClass('inactive');
				$(cup).children().addClass('dark')
			} else {
				$(cup).removeClass('dark');
				$(cup).children().removeClass('dark')
			}
			cup.amount = amount;
		},
		
		_pour: function(first,second){ // first = the pourer / to be poured - second = the pouree / to be filled
			var amountLeft = second.size - second.amount; // available amount in cup to be filled					
			if (amountLeft >= first.amount){ // poured amount completely fits in new cup
				Cups._fill(second,second.amount + first.amount); // fill second cup with amount from first
				Cups._fill(first,0); // empty the first cup
			} else { // cup to be filled not large enough for full amount
				var leftovers = first.amount - amountLeft;  //find leftovers from pour
				Cups._fill(second,second.size); // fill 2nd cup
				Cups._fill(first,leftovers); // leftovers remain in 1st cup	
			}
			Cups._checkWinner();
		},
		
		_displayAmount: function(cup,amount){
			var label = $(cup).siblings();			
			label.html(amount + " oz");
		},
		
		_displayGoal: function(cups, goal){
			var goalContainer = $('.goal'),
				goalAmount = goal,
				cupArray = new Array();
			cups.each(function (i){
				cupArray[i] = this.size;
			});
			$(goalContainer).html('Pour contents from glass to glass. The goal is to end with ' + goal + 'oz in the '+ cupArray[0] + 'oz and ' + cupArray[1] + 'oz glasses, and 0oz in the ' + cupArray[2] + 'oz glass. Good luck! ');
		},
		
		_checkWinner: function(){
			var cups = this.cups,
						goalReached = 0;
			cups.each(function (){
				if (this.amount == goal){
					goalReached++;
					if (goalReached == 2){
						alert('winner!');
					}
				}	
			});
		},
	
		build: function (){
			this.cups = $('.cup');
			var cups = this.cups,
						wrap = '<div class="group" />',
						label = '<div class="text-bubble" />',
						fill = '<div class="fill" />';
			cups.each(function (i){
				this.amount = 0;
				this.size = parseInt($(this).attr('data'));		
				// building appearance of cups
				$(this).wrap(wrap); 
				$(this).append(fill);
				$(this).parent().height(this.size + 'em');
				$(this).parent().addClass('group' + i);
				$(this).parent().append(label);
				// set goal amount
				if ($(this).parent().index() == 0){
					this.amount = parseInt($(this).attr('data'));
					goal = this.amount/2;
				}		
				Cups._fill(this,this.amount);
				Cups._displayAmount(this,this.size);
			});
			Cups._displayGoal(cups, goal);
		},
		
		click: function (){
			var cup = this.cups,
						first,
						second;
			cup.click(function () {
				var noneClicked = true;
				cup.each( function() {
					if ($(this).hasClass('clicked')){
						noneClicked = false;
					}
				});
				if ($(this).hasClass('clicked')){
					$(this).removeClass('clicked');
				} else {
					if (noneClicked == true){
						if ($(this).hasClass('inactive')){
							return;
						} 
						$(this).addClass('clicked');
						first = this;
						$('.cup').removeClass('inactive');
					} else {
						$(this).addClass('clicked');
						second = this;
						Cups._pour(first,second);
						// resetting cups
						first = '',
						second = '';
						cup.each( function(){
							$(this).removeClass('clicked');
							Cups._fill(this,this.amount);
						});
					}
				}	
			});
		}
	}
	Cups.init();
});
