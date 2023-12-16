var input = document.getElementById('imagen');
var cardsContantainer = document.getElementById('cards-container');

input.addEventListener('change', function() {
  if (input.files && input.files[0]) {
    var imagenEnVariable = URL.createObjectURL(input.files[0]);

    // Crear un nuevo contenedor para cada imagen
    var card = document.createElement('div');
    card.id = 'card';
    cardsContantainer.appendChild(card);

    var divContainer = document.createElement('div');
    divContainer.id = 'imagenColor';
    card.appendChild(divContainer);

    var paletaPrincipal = document.createElement('div');
    paletaPrincipal.id = 'paletaPrincipal';
    divContainer.appendChild(paletaPrincipal);
    
    var paletaDeColores = document.createElement('div');
    paletaDeColores.id = 'paletaColores';
    card.appendChild(paletaDeColores);

    var paletaDeColoresPrincipal = document.createElement('div');
    paletaDeColoresPrincipal.id = 'paletaColoresPrincipal';
    paletaDeColores.appendChild(paletaDeColoresPrincipal);

    var paletaDeColoresAdicional = document.createElement('div');
    paletaDeColoresAdicional.id = 'paletaColoresAdicional';
    paletaDeColores.appendChild(paletaDeColoresAdicional);
    
    var colorThief = new ColorThief();
    var img = new Image();
    img.src = imagenEnVariable;

    img.onload = function() {
      var coloresDominantes = colorThief.getColor(img);
      console.log('Color dominante:', coloresDominantes);

      var fondoEsOscuro = esColorOscuro(`rgb(${coloresDominantes[0]}, ${coloresDominantes[1]}, ${coloresDominantes[2]})`);

      var paletaColores = colorThief.getPalette(img, 5);
      console.log('Paleta de colores:', paletaColores);
      
      var baseColor = tinycolor(`rgb(${coloresDominantes[0]}, ${coloresDominantes[1]}, ${coloresDominantes[2]})`);
      var complementario = baseColor.complement().toHexString();

      // Imprimir los resultados en la consola
      console.log('Complementario:', complementario);

      paletaColores.forEach(function(color, index) {
        var caja = document.createElement('div');
        caja.id = 'caja';
        var cadaAdicional = document.createElement('div');
        cadaAdicional.id = 'cajaAdicional';
        var cajaBaseColor = tinycolor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        var complementarioAdicional = cajaBaseColor.complement().toHexString();
        caja.style.backgroundColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
        paletaDeColoresPrincipal.appendChild(caja);
        cadaAdicional.style.background = complementarioAdicional;
        paletaDeColoresAdicional.appendChild(cadaAdicional);
      });

      var cajaComplementario = document.createElement('div');
      cajaComplementario.id = 'cajaColor';
      cajaComplementario.style.background = complementario;

      // Determinar si el color de fondo es oscuro y ajustar el color del texto
      if (fondoEsOscuro) {
        cajaComplementario.classList.add('fondo-oscuro');
      } else {
        cajaComplementario.classList.remove('fondo-oscuro');
      }

      paletaPrincipal.appendChild(cajaComplementario);

      var cajaColor = document.createElement('div');
      cajaColor.id = 'color';
      cajaColor.style.backgroundColor = `rgb(${coloresDominantes[0]}, ${coloresDominantes[1]}, ${coloresDominantes[2]})`;
      
      // Agregar el CSS adicional para el elemento #color
      var textoColor = document.createElement('div');
      textoColor.id = 'colorTexto';
      textoColor.innerHTML = 'Color Base';
      
      // Aplicar un estilo similar al de #cajaColor
      if (fondoEsOscuro) {
        textoColor.classList.add('fondo-oscuro');
      }

      cajaColor.appendChild(textoColor);
      
      divContainer.appendChild(img);
      paletaPrincipal.appendChild(cajaColor);
    };
  } else {
    console.log('El archivo seleccionado no es una imagen.');
  }
});

function esColorOscuro(color) {
  var r, g, b, hsp;
  if (String(color).match(/^rgb/)) {
    color = color.match(/rgb\(([^)]+)\)/)[1];
    color = color.split(/ *, */).map(Number);
    r = color[0];
    g = color[1];
    b = color[2];
  } else {
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'
    )
    );
    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );
  return hsp < 127.5;
}
