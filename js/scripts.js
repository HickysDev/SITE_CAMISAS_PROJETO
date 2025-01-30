// Objeto para pegar os preços e as fotos das camisetas

var camisetas = {
    'branca': {
        
        'gola_v': {
            'sem_estampa': {
                'preco_unit': 5.12,
                'foto': 'v-white.jpg' 
            },
            'com_estampa': {
                'preco_unit': 8.95,
                'foto': 'v-white-personalized.jpg' 
            }
        },
        
        'gola_normal': {
            'sem_estampa': {
                'preco_unit': 4.99,
                'foto': 'normal-white.jpg' 
            },
            'com_estampa': {
                'preco_unit': 8.77,
                'foto': 'normal-white-personalized.jpg' 
            }
        }
    },
    
    'colorida': {
        'gola_v': {
            'sem_estampa': {
                'preco_unit': 6.04,
                'foto': 'v-color.jpg' 
            },
            'com_estampa': {
                'preco_unit': 9.47,
                'foto': 'v-color-personalized.png' 
            }
        },
        
        'gola_normal': {
            'sem_estampa': {
                'preco_unit': 5.35,
                'foto': 'normal-color.jpg' 
            },
            'com_estampa': {
                'preco_unit': 9.28,
                'foto': 'normal-color-personalized.jpg' 
            }
        }
    }
}


// parâmetros da pesquisa

var parametros_pesquisa = {
    "quantidade": 10,
    "cor": "colorida",
    "gola": "gola_v",
    "qualidade": "q150",
    "estampa": "com_estampa",
    "embalagem": "bulk"
}


// Regras adicionais para o orçamento:

// 1. Verificar se há em localStorage os parâmetros do último orçamento e se houver, carregar a página com eles.

// 2. A camisa de qualidade alta (190g/m2) deve acrescer o preço unitário em 12%.

// 3. A embalagem unitária tem um custo de 0.15 por unidade

// 4. Após cálculo do preço, há que se aplicar um desconto por quantidade, sendo: 
    // faixa 1: acima de 1.000 - Desconto de 15%
    // faixa 2: acima de 500 - Desconto de 10%
    // faixa 3: acima de 100 - Desconto de 5%

// Resolução do desafio:

$(function(){

    //Ja enviando os dados

    if(window.localStorage["quantidade"]){
        parametros_pesquisa.quantidade = window.localStorage["quantidade"];

        console.log(parametros_pesquisa)
    }
    if(window.localStorage["cor"]){
        parametros_pesquisa.cor = window.localStorage["cor"];
    }
    if(window.localStorage["gola"]){
        parametros_pesquisa.gola = window.localStorage["gola"];
    }
    if(window.localStorage["qualidade"]){
        parametros_pesquisa.qualidade = window.localStorage["qualidade"];
    }
    if(window.localStorage["estampa"]){
        parametros_pesquisa.estampa = window.localStorage["estampa"];
    }
    if(window.localStorage["embalagem"]){
        parametros_pesquisa.embalagem = window.localStorage["embalagem"];
    }

    carregaOrcamento(parametros_pesquisa);
    atualizandoValores(parametros_pesquisa);

    //Buscando parametros da tela
    $('#quantidade').keyup(function(){
        parametros_pesquisa["quantidade"] = $(this).val();

        atualizarLocalStorage(parametros_pesquisa);
        carregaOrcamento(parametros_pesquisa);
        atualizandoValores(parametros_pesquisa);
    })

    //Vendo os botões
    $(".option-filter div").click(function(){
        $(this).parent().children("div").removeClass("selected");
        $(this).addClass("selected");

        var categoria = $(this).parent().attr("id");

        parametros_pesquisa[categoria] = $(this).attr("id");

        atualizarLocalStorage(parametros_pesquisa);
        carregaOrcamento(parametros_pesquisa);
        atualizandoValores(parametros_pesquisa);
    })

    //Vendo o select
    $("select").change(function(){

        var categoria = $(this).attr("id");

        parametros_pesquisa[categoria] = $(`#${$(this).attr('id')}`).val();

        atualizarLocalStorage(parametros_pesquisa);
        carregaOrcamento(parametros_pesquisa);
        atualizandoValores(parametros_pesquisa);
    })

    //Local Storage

    function atualizarLocalStorage(parametro){
        window.localStorage.setItem("quantidade", parametro.quantidade);
        window.localStorage.setItem("cor", parametro.cor);
        window.localStorage.setItem("gola", parametro.gola);
        window.localStorage.setItem("qualidade", parametro.qualidade);
        window.localStorage.setItem("estampa", parametro.estampa);
        window.localStorage.setItem("embalagem", parametro.embalagem);

        
    }

    //Função que faz quase tudo
    function carregaOrcamento(parametro){


        //Setando as variaveis do array
        var quantidade = parametro.quantidade;
        var cor = parametro.cor;
        var gola = parametro.gola;
        var qualidade = parametro.qualidade;
        var estampa = parametro.estampa;
        var embalagem = parametro.embalagem;

        //Setando outras variaveis
        var custoEmbalagem = 0;
        var precoFinal = 0;

        //Pegando o tipo de camisa
        var preco = camisetas[cor][gola][estampa]["preco_unit"];
        var foto = camisetas[cor][gola][estampa]["foto"];

        //Calculando

        //Vendo a qualidade e aplicando o preço
        if(qualidade == "q190"){
            preco = preco + (preco * 0.12);
        }

        precoFinal = preco * quantidade;

        //Vendo a embalageme calculando 
        if(embalagem == "unitaria"){
            custoEmbalagem = 0.15 * quantidade;
        }

        precoFinal = precoFinal + custoEmbalagem;

        //Calculando os descontos
        if(quantidade >= 1000){
            precoFinal = precoFinal - (precoFinal * 0.15);
        } 
        else if(quantidade >= 500){
            precoFinal = precoFinal - (precoFinal * 0.10);
        }
        else if(quantidade >= 100){
            precoFinal = precoFinal - (precoFinal * 0.05);
        }

        $('.refresh-loader').show();

        
        $('#valor-total').html(precoFinal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))
    }
    
    function atualizandoValores(parametro){
        //Setando as variaveis do array
        var quantidade = parametro.quantidade;
        var cor = parametro.cor;
        var gola = parametro.gola;
        var qualidade = parametro.qualidade;
        var estampa = parametro.estampa;
        var embalagem = parametro.embalagem;

        var foto = "img/" + camisetas[parametro.cor][parametro.gola][parametro.estampa].foto;

        window.setTimeout(function(){
            //Setando os valores na tela
            $('#result_gola').html($(`#${gola}`).text())
            $('#result_estampa').html($(`option[value='${estampa}']`).html())
            $('#result_qualidade').html($(`#${qualidade}`).text())
            $('#result_cor').html($(`#${cor}`).text())
            $('#result_embalagem').html($(`option[value='${embalagem}']`).html())
            $('#result_quantidade').html(quantidade)
    
            $('.refresh-loader').hide();
            }, 1000)

        $('#quantidade').val(quantidade);
        $('#estampa').val(estampa);

        $('#cor').children().removeClass("selected") 
        $(`#${cor}`).addClass("selected"); 

        $('#gola').children().removeClass("selected") 
        $(`#${gola}`).addClass("selected"); 

        $('#qualidade').children().removeClass("selected") 
        $(`#${qualidade}`).addClass("selected"); 

        $('#foto-produto').attr("src",foto);
    }
});