
class Arco {

    constructor(){
        this.canvas = document.getElementById("lienzo")
        this.alturaCanvas = this.canvas.offsetHeight
        this.anchoCanvas = this.canvas.offsetWidth
        this.ctx = this.canvas.getContext("2d")
        this.spResultado = document.getElementById('resultado')
        this.btnRefrescar = document.getElementById('refrescar')
        this.x1 = undefined
        this.y1 = undefined
        this.puntitos = []
        this.finalizado = false
        this.iniciarDemo()
    }

    iniciarDemo(){
        //dibujar circulos
        const offsetInicial = 50
        this.dibujarCirculo( offsetInicial, this.alturaCanvas - offsetInicial )
        this.dibujarCirculo( this.anchoCanvas - offsetInicial, offsetInicial )

        //crear reticula
        this.crearReticula()

        //crear eventos para canvas
        this.canvas.onmousedown = (ev) => this.marcarInicio(ev)
        this.canvas.onmousemove = (ev) => this.dibujarArco(ev)
        this.canvas.onmouseup = () => this.finalizarTrazo()
        // this.canvas.ontouchstart = (ev) => this.marcarInicioCel(ev)
        // this.canvas.ontouchmove = (ev) => this.dibujarArcoCel(ev)
        // this.canvas.ontouchend = () => this.finalizarTrazo()
        this.btnRefrescar.onclick = () => location.reload()

    }

    dibujarCirculo( x, y ){
        this.ctx.beginPath()
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI)
        this.ctx.fillStyle = "green"
        this.ctx.fill()
    }

    crearReticula(){

        const numeroLineas = 9
        let espaciador = this.anchoCanvas / (numeroLineas + 1)
        let iterador = espaciador

        for (let i = 0; i < numeroLineas; i++) {
            this.crearLineaVertical( iterador )
            this.crearLineaHorizontal( iterador )
            iterador += espaciador
        }
    }

    crearLineaVertical( x ){
        this.ctx.beginPath()
        this.ctx.moveTo( x, 0 )
        this.ctx.lineTo( x, this.alturaCanvas )
        this.ctx.strokeStyle = "#e6791e"
        this.ctx.stroke()
    }

    crearLineaHorizontal( y ){
        this.ctx.beginPath()
        this.ctx.moveTo( 0, y )
        this.ctx.lineTo( this.anchoCanvas, y )
        this.ctx.strokeStyle = "#e6791e"
        this.ctx.stroke()
    }

    marcarInicio( ev ){

        if( this.finalizado ) return 
    
        const { offsetX: x, offsetY: y } = ev
        this.x1 = x
        this.y1 = y
        this.ctx.beginPath()
    }

    // marcarInicioCel( ev ){

    //     if( this.finalizado ) return

    //     const { pageX: x, pageY: y } = ev.touches[0]
    //     this.x1 = x
    //     this.y1 = y
    //     this.ctx.beginPath()
    // }

    dibujarArco( ev ){

        if( !this.x1 || !this.y1 || this.finalizado ) return

        const { offsetX: x, offsetY: y } = ev

        if( this.x1 == x ) return 

        this.puntitos.push({ x, y: this.alturaCanvas - y })
        this.ctx.moveTo( this.x1, this.y1 )
        this.ctx.lineTo( x, y )
        this.ctx.stroke();
        this.x1 = x
        this.y1 = y
    }

    // dibujarArcoCel( ev ){

    //     if( !this.x1 || !this.y1 || this.finalizado ) return

    //     const { pageX: x, pageY: y } = ev.touches[0]

    //     if( this.x1 == x ) return 

    //     this.puntitos.push({ x, y: this.alturaCanvas - y })
    //     this.ctx.moveTo( this.x1, this.y1 )
    //     this.ctx.lineTo( x, y )
    //     this.ctx.stroke();
    //     this.x1 = x
    //     this.y1 = y
    // }

    finalizarTrazo(){

        if( this.finalizado ) return

        this.calcularDerivada()
        this.spResultado.textContent = this.calcularDerivada() + ' a.u.'
        this.finalizado= true
    }

    calcularDerivada(){

        let suma = 0

        for( let i = 0; i < this.puntitos.length - 1; i++ ){

            let calculoDx = this.puntitos[i + 1].x - this.puntitos[i].x
            let caluclofp = (this.puntitos[i + 1].y -  this.puntitos[i].y) / calculoDx
            let calculoRaiz = Math.sqrt( caluclofp**2 + 1 )
            suma += calculoRaiz * calculoDx
        }

        return suma.toFixed(1)
    }
}

const lienzo = new Arco