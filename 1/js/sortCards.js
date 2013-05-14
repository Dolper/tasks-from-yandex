function TravelCardsWorker() {

	var cards = [],//не отсортированные карточки
		sortedCards = [];//отсортированные карточки

	/**	Сортировка карточек + генерация маршрута
		@cards - массив карточек карточек
		@exemple: [
		{
            'from': 'FR-paris',
            'fromTitle': 'FR, Gare Port Lazare',
            'to': 'RU-moscow',
            'toTitle': 'РФ, Москва Речной вокзал',
			'type': 'ship',
			'other': {
				'name': 'Victoria',
				'deck': '1',
				'cabin': '175',
				...
			}
        }, ...
		]
		@return - HTML описание маршрута
	*/
	this.outputRoute = function(cards)
	{
		var startCard;
		
		if(cards.length==0) return errorMessegs.noData;
	    inputCards(cards);//импорт карточек
		
		startCard = a();//получить карточку с которой начинается путешествие
		if(!startCard) return errorMessegs.cycleRoute;
		
		sort(startCard);//запуск сортировки начиная со стартовой карточки
		if(cards.length>0) return errorMessegs.notChain;
		
		return makeText(outputFormat.RU); //сгенерировать описание маршрута по шаблону "outputFormat.RU"
	}
	
	/** Возвращает HTML-код не отсортированных карточек
		@cards: массив карточек
		@exemple: [
		{
            'from': 'FR-paris',
            'fromTitle': 'FR, Gare Port Lazare',
            'to': 'RU-moscow',
            'toTitle': 'РФ, Москва Речной вокзал',
			'type': 'ship',
			'other': {
				'name': 'Victoria',
				'deck': '1',
				'cabin': '175',
				...
			}
        }, ...
		]
		@return: HTML карточек
	*/
	this.outputCards = function(cards)
	{
		var out="Исходные карточки:";
			for(var i in cards){
			switch(cards[i].type)
			{
				case 'train':
					out += "<div class='card "+cards[i].type+"'><div class='icon'></div><div class='label'>"+cards[i].from+"-<br />"+cards[i].to+"</div></div>";
				break;
				case 'plane':
					out += "<div class='card "+cards[i].type+"'><div class='icon'></div><div class='label'>"+cards[i].from+"-<br />"+cards[i].to+"</div></div>";
				break;
				case 'ship':
					out += "<div class='card "+cards[i].type+"'><div class='icon'></div><div class='label'>"+cards[i].from+"-<br />"+cards[i].to+"</div></div>";
				break;
			}
		}
		return out;
	}
		
	/**
		Шаблоны вывода текстового маршрута для разных видов транспорта
	*/
	var outputFormat = {
		'EN':{
			'train': 'Take train number {0} from {1} to {2}. Wagon/Seat: {3}/{4}. Linen:{5}.',
			'plane': 'Take plane: {0} from {1} to {2}. Seat #{3}. Food:{4}',
			'ship': 'Take ship "{0}" from {1} to {2}. {3}-cabin, deck #{4}.'
		},
		'RU':{
			'train': 'Сядьте на поезд №{0} из {1} и проследуйте до {2}. Номер Вашего вагона/места: {3}/{4}. Постельное бельё:{5}.',
			'plane': 'Вылетайте на самолёте рейсом: {0} из {1} - до {2}. Ваше место №{3}. Еда:{4}',
			'ship': 'Отплывайте кораблём "{0}" из {1}, он доставит Вас в {2}. {3} - номер вашей каюты, находится на палубе №{4}.'
		}
	};

	/**
		Описание ошибок работы сортировщика
	*/
	var errorMessegs = {
		'noData': '<h2 class="error">Ошибка: Данные отсутствуют</h2>',
		'notChain': '<h2 class="error">Ошибка: Карточки не образуют цепочку</h2>',
		'cycleRoute': '<h2 class="error">Ошибка: Цеклический маршрут</h2>'
	};
	
	/** Импорт карточек путешественника
		@data: массив карточек
		@exemple: [
		{
            'from': 'FR-paris',
            'fromTitle': 'FR, Gare Port Lazare',
            'to': 'RU-moscow',
            'toTitle': 'РФ, Москва Речной вокзал',
			'type': 'ship',
			'other': {
				'name': 'Victoria',
				'deck': '1',
				'cabin': '175',
				...
			}
        }, ...
		]
	*/	
	var inputCards = function(data){
		cards = data;
	};
	
	/**
		Возвращает карточку с которой начинается маршрут
	*/
	var a = function()
	{
		var to = [];
			
		cards.map(function(cards){
			to.push(cards.to);
		});
		
		for(var i = 0; i<cards.length; i+=1){
			if(!to.inArray(cards[i].from)){
				sortedCards.push(cards[i]);
				return cards.splice(i,1)[0];
			}
		}
	};
	
	/** Сортирует карточки по их месту отправления и назначения
		@data: массив карточек
		@exemple: [
		{
            'from': 'FR-paris',
            'fromTitle': 'FR, Gare Port Lazare',
            'to': 'RU-moscow',
            'toTitle': 'РФ, Москва Речной вокзал',
			'type': 'ship',
			'other': {
				'name': 'Victoria',
				'deck': '1',
				'cabin': '175'
			}
        }, ...
		]
	*/
	var sort = function(card)
	{
		for(var i = 0; i<cards.length; i+=1){	
			if(card.to==cards[i].from){			
				sortedCards.push(cards[i]);
				sort(cards.splice(i,1)[0]);
			}
		}
	};
	
	/** Генерация HTML текста маршрута
		@tmpl: шаблон вывода outputFormat
		@exemple: outputFormat.RU
		@return HTML текстовка маршрута
	*/
	var makeText = function(tmpl){
		var out = "<p>Чтобы проделать ваше путеществие, Вам понадобится:</p>";
		for(var i in sortedCards){
			switch(sortedCards[i].type)
			{
				case 'train':
					out += "<p>"+tmpl.train
					.replace('{0}', sortedCards[i].other.number)
					.replace('{1}', sortedCards[i].fromTitle)
					.replace('{2}', sortedCards[i].toTitle)
					.replace('{3}', sortedCards[i].other.wagon)
					.replace('{4}', sortedCards[i].other.seat)
					.replace('{5}', (sortedCards[i].other.linen)?'(+)':'(-)')+"</p>";
				break;
				case 'plane':
					out += "<p>"+tmpl.plane
					.replace('{0}', sortedCards[i].other.number)
					.replace('{1}', sortedCards[i].fromTitle)
					.replace('{2}', sortedCards[i].toTitle)
					.replace('{3}', sortedCards[i].other.seat)
					.replace('{4}', (sortedCards[i].other.food)?'(+)':'(-)')+"</p>";
				break;
				case 'ship':
					out += "<p>"+tmpl.ship
					.replace('{0}', sortedCards[i].other.name)
					.replace('{1}', sortedCards[i].fromTitle)
					.replace('{2}', sortedCards[i].toTitle)
					.replace('{3}', sortedCards[i].other.cabin)
					.replace('{4}', sortedCards[i].other.deck)+"</p>";
				break;
			}
		}
		return out;
	};
}

Array.prototype.inArray = function(elem){
	for(var i = 0; i<this.length; i+=1){
		if(this[i]==elem)
			return true;
	}
	return false;
}
