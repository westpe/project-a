function get_time(unix){
  var date = new Date(parseFloat(unix)*1000);
  var min = "";
  if (date.getMinutes() < 10) {
    min = '0' + date.getMinutes();
  } else {
    min = date.getMinutes();
  }
  var formattedTime = date.getHours()+':'+ min +', '+ date.getDate() +'.' + date.getMonth() +'.'+ date.getFullYear();
  return formattedTime;

  }

function  getDateShort(unix){
    var date = new Date(parseFloat(unix)*1000);
    var formattedTime = date.getDate() +'.' + date.getMonth() +'.'+ date.getFullYear();
    return formattedTime;
  }

function getDayName(unix){
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var date = new Date(parseFloat(unix)*1000);
  return days[date.getDay()];

}

function get_data(item){
  document.getElementById("api").innerHTML +=', ' +  get_time(item.dt) + '<br/>';
}

function get_cels(kelvin){
  var nula = -273.15;
  return (kelvin + nula).toFixed(2) + ' °C';

}

  function get_lat_lon_api(city){
    console.log('here');
    var api_key = '94cbd053ebd0e3bbcbf2727bae186630';
    var url = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=' + api_key;
    var lat;
    var lon;
    var dic = [];
    var request = new XMLHttpRequest();

    // document.getElementById("city").innerHTML= 'Ci';

    request.open('GET', url, true)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);

      if (request.status >= 200 && request.status < 400){
        lat = data.coord.lat;
        lon = data.coord.lon;
        console.log(data);
        document.getElementById("city").innerHTML = data.name;
        document.getElementById("error").innerHTML = '' ;
        getApi(lat, lon);
      } else {
        console.log(request.status);
        if (request.status == 400) {
          document.getElementById("error").innerHTML = 'City name is required' ;
        }else if (request.status == 404) {
          document.getElementById("error").innerHTML = 'City not found';
        }
        else{
        console.log('error')
      }
      }
    }
    request.send()
    console.log([lat,lon]);
  }

function getApi(lat, lon){
      var api_key = '94cbd053ebd0e3bbcbf2727bae186630'
      var url_forecasts  = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely&appid='+ api_key;

      var request = new XMLHttpRequest()
      var dic = [];

        request.open('GET', url_forecasts, true)
        request.onload = function () {
          // Begin accessing JSON data here
          var data = JSON.parse(this.response);

          if (request.status >= 200 && request.status < 400) {

            document.getElementById("api-single").innerHTML = data.timezone;
            document.getElementById("day").innerHTML = getDayName(data.current.dt);
            document.getElementById("cur-temp").innerHTML = get_cels(data.current.temp);
            document.getElementById("cur-sunrise").innerHTML = get_time(data.current.sunrise);
            document.getElementById("cur-sunset").innerHTML = get_time(data.current.sunset);
            document.getElementById("cur-wind_speed").innerHTML = data.current.wind_speed + ' m/s';
            document.getElementById("cur-weather-desc").innerHTML = data.current.weather[0].description;
            data.daily.forEach(day => {
                dic.push({'day':getDateShort(day.dt),'temp':get_cels(day.temp.day)});
            });

            addToGraph(dic)

          } else {
            console.log('error');
          }
        }
        request.send()
        }

function avg(arr){
  const sum = arr.reduce((a, b) => a + b, 0);
  return (sum / arr.length) || 0;
}

function addToGraph(dailyDic){
  console.log('addto graph');
  console.log(dailyDic);
  var lab = [];
  var dat = [];
  dailyDic.forEach(el=>{
    lab.push(el.day);
    dat.push(parseFloat(el.temp))
  });
  var ctx = document.getElementById("myChart").getContext('2d');
  var colorback = ''
  var colorbor = ''
  if (avg(dat)< 5) {
    colorback = 'rgb(150,254,254, 1)';
    colorbor = 'rgb(150,254,254, 0.8)';
  } else {
    colorback = 'rgb(255, 99, 132, 1)';
    colorbor = 'rgb(255, 99, 132, 0.8)';
  }
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: lab,
      datasets: [{
        label: 'temp',
        backgroundColor: colorbor,
        borderColor: colorbor,
        data: dat,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Forecast'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Days'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: '[°C]'
          }
        }]
      }
    }
  });
}
