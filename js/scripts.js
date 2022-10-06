
$(function(){

    function gerarGrafico(dates, cotacao){
        Highcharts.chart('hourly_chart', {
            chart: {
              type: 'spline'
            },
            title: {
              text: 'Cotação Dia a Dia'
            },
            xAxis: {
              categories: dates,
              accessibility: {
                description: 'Valor (R$)'
              }
            },
            yAxis: {
              title: {
                text: 'Valor Dola/Real'
              },
              labels: {
                formatter: function () {
                  return this.value + ' R$';
                }
              }
            },
            tooltip: {
              crosshairs: true,
              shared: true
            },
            plotOptions: {
              spline: {
                marker: {
                  radius: 4,
                  lineColor: '#666666',
                  lineWidth: 1
                }
              }
            },
            series: [{     
              showInLegend: false,        
              data: cotacao
          
            }]
          });         

    }

    function formataData(data){
        let dataFormatada = parseInt(data * 1000);
        dataFormatada = new Date(dataFormatada).toLocaleDateString("pt-BR");
        return dataFormatada;
    }

    function pegarValorUltimos5DiasDolar(){
        $.ajax({
            url: "https://economia.awesomeapi.com.br/json/daily/USD-BRL/7",
            type: "GET",
            dataType: "json",
            success: function(data){
                let dias = [];
                let valorFechamento = [];

                for (let i = 0; i < 7; i++){
                    let valor = data[i].ask;
                    valor = parseFloat(valor);

                    let dataDolar = data[i].timestamp;
                    dataDolar = formataData(dataDolar);

                    dias.push( String(dataDolar));
                    valorFechamento.push(valor);
                }

                dias = dias.reverse();
                valorFechamento = valorFechamento.reverse();
                
                gerarGrafico(dias, valorFechamento);
                               
            },
            error: function(){
                gerarErro("Erro");
            }
    
        });
    }

    function pegarValorAtualDolar(){
        $.ajax({
            url: "https://economia.awesomeapi.com.br/json/last/USD-BRL",
            type: "GET",
            dataType: "json",
            success: function(data){
                let valor = data.USDBRL.ask;
                valor = formatarValorMoeda(valor);

                let textoNome = data.USDBRL.name;
                let variacao = data.USDBRL.varBid;  
                
                let dataTeste = data.USDBRL.timestamp;
                dataTeste = parseInt(dataTeste);

                dataTeste = new Date(dataTeste);

                preencherValoresMoeda(valor, textoNome, variacao);
                
            },
            error: function(){
                gerarErro("Erro");
            }
    
        });
    }

    function formatarValorMoeda (valor){
        let val = parseFloat(valor);
        val = val.toFixed(4);
        val = val.replace(".", ",");
        return val;
    }

    function preencherValoresMoeda(valor, textoNome, variacao){
        $("#texto_moeda").html(textoNome);
        $("#texto_valor").html(valor);

        if (variacao < 0){
           $("#icone_variacao").css("background-image", "url('img/dolar-baixa.png')" );
           $("#texto_variacao").html(variacao + " &percnt;");
           $("#texto_variacao").css("color", "red");
        } else {
            $("#icone_variacao").css("background-image", "url('img/dolar-alta.png')" );
            $("#texto_variacao").html(variacao + " &percnt;");
            $("#texto_variacao").css("color", "green");
        }

        window.setTimeout(function(){           
            pegarValorAtualDolar();
        }, 30000);

    }
  
    function gerarErro(mensagem){

        if(!mensagem){
            mensagem = "Erro na solicitação";
        }

        $('.refresh-loader').hide();
        $("#aviso-erro").text(mensagem);
        $("#aviso-erro").slideDown();
        window.setTimeout(function(){
            $("#aviso-erro").slideUp();
        }, 4000);

    }

    function animarLetreiroCotacoes () {
      var para1 = document.getElementById("para1");
      animate(para1);

      let valEuro = "5,11";
      let valOuro = "286,11";
      let valBitcoin = "104.000,00"
      para1 = $("#para1").html("<b>EURO:</b>&nbsp;" + valEuro + "R$&nbsp;<b>OURO:</b>&nbsp;"+ valOuro + "R$&nbsp;<b>Bitcoin:</b>&nbsp;" + valBitcoin + "R$");

      function animate(element) {
          let elementWidth = element.offsetWidth;
          let parentWidth = element.parentElement.offsetWidth;
          let flag = 0;
      
          setInterval(() => {
              element.style.marginLeft = --flag + "px";
      
              if (elementWidth == -flag) {
                  flag = parentWidth;
              }
          }, 20);
      }
    }
       
    pegarValorAtualDolar();
    pegarValorUltimos5DiasDolar();
    animarLetreiroCotacoes();

});