var countryFeedKey = 'egypt';	//try china, spain, italy, etc.
var countryName = 'EGYPT';		//try 中国, España, Italia, etc.
var arra=[];// array to store value for chart

function ready(cb) {
  if( document.readyState !== 'loading' ) {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
        cb();
    });
  }
}

function fetchData(url) {
  return fetch(url)
    .then(function(response) {
      if(response.ok) {
        return response.json();
      }
    })
    .then(function(payload) {
      return payload['data'] || {};
    });
}

function formatNumber(number, precision, separate, separator, comma) {
  if(!number) {
    return '';
  }

    var re = '\\d(?=(\\d{' + (separate || 3) + '})+' + (precision > 0 ? '\\D' : '$') + ')',
        num = number.toFixed(Math.max(0, ~~precision));

    return (coma ? num.replace('.', comma) : num).replace(new RegExp(re, 'g'), '$&' + (separator || ','));
};

function fillPlaceholders(data) {
  var i;
  var varEl = document.querySelectorAll('[data-var-placeholder]');
//contryname
  for(i = 0; i < varEl.length; i++) {
    var placeholder = varEl[i].getAttribute('data-var-placeholder');

    if(placeholder && placeholder != '') {
      switch(placeholder) {
        case 'country':
          varEl[i].innerText = countryName;    
          break;
      }
    }
  }

  var countryPlaceholderEl = document.querySelectorAll('[data-country-placeholder]');
	
	
  for(i = 0; i < countryPlaceholderEl.length; i++) {
    var placeholder = countryPlaceholderEl[i].getAttribute('data-country-placeholder');
	
    if(placeholder && placeholder != '' && data['summary'][placeholder]) {
     arra[i]=parseInt(data['summary'][placeholder]);
	 countryPlaceholderEl[i].innerText = parseInt(data['summary'][placeholder]).toLocaleString();
	
	 
	
    }
  }
  
 //code for chart
 Chart.defaults.global.defaultFontSize= 16;
  
  var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Confirmed', 'Active', 'Recoverring','Deaths', 'Tested', 'Critical '],
        datasets: [{
            
			label:'COVID-19 EGYPT    ',
			data: [arra[0],arra[1],arra[2],arra[3],arra[4],arra[5]],
			fill:false,
			borderColor: [
                'lightblue'
            ],
			 pointBackgroundColor: [
                '#c82333 ',
				'#ffc107',
                '#218838',                
                '#5a6268',
                '#0069d9',
                '#c82340',
            ],
			
            
            
            borderWidth: 2,
			pointBorderWidth:15,
			pointRadius:6,
			pointHoverRadius:16,
			
			
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true	
                }
            }]
        }
    },	
	
	options: {
        legend: {
            labels: {
				
                fontSize: 24
			
            }
	}
	},
	
	 
	
	
});
  myChart.config.data.datasets[0]['pointBackgroundColor'][0] = 'red';
  
  Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 50;
};

 //code for chart END 
  
}

ready(
  function() {
    var url = 'https://api.quarantine.country/api/v1/summary/region?region=' + countryFeedKey;

    fetchData(url)
        .then(fillPlaceholders);

    setInterval(
      function() {
        fetchData(url)
          .then(fillPlaceholders);
      },
      10000
    );
  }
);



