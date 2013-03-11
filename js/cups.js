jQuery(function ($) {
	var Cups = {
		init: function () {
			var goal;
			this.build();
			this.click();
		},

		_fill: function(cup,amount){
			$(cup).find('.fill').height(amount + 'em').html('<p>' + amount + '</p>');
			if (amount == 0){
				$(cup).find('.fill p').addClass('dark');
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
			var cups = this.cups;
			cups.each(function (i){
				this.amount = 0;
				this.size = parseInt($(this).attr('data'));
				$(this).height(this.size + 'em');
				if ($(this).index() == 0){
					this.amount = parseInt($(this).attr('data'));
					Cups._fill(this,this.amount);
					goal = this.amount/2;
				}
			});
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
						$(this).addClass('clicked');
						first = this;
					} else {
						$(this).addClass('clicked');
						second = this;
						Cups._pour(first,second);
						// resetting cups
						first = '',
						second = '';
						cup.each( function(){
							$(this).removeClass('clicked');
						});
					}
				}	
			});
		}
	}
	Cups.init();
});
