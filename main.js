
class Arco {

    constructor(){
        this.canvas = document.getElementById("lienzo")
        this.ladoCanvas = 500
        this.alturaCanvas = null
        this.anchoCanvas = null
        this.ctx = this.canvas.getContext("2d")
        this.spResultado = document.getElementById('resultado')
        this.btnRefrescar = document.getElementById('refrescar')
        this.btnSnapshot = document.getElementById('snapshot')
        this.btnDescarga = document.getElementById('download')
        this.imgSnapshot = document.getElementById('snapshotCanvas')
        this.x1 = undefined
        this.y1 = undefined
        this.puntitos = []
        this.iniciarDemo()
    }

    iniciarDemo(){
        //definir tamano canvas
        this.canvas.width = this.ladoCanvas
        this.canvas.height = this.ladoCanvas
        this.alturaCanvas = this.canvas.offsetHeight
        this.anchoCanvas = this.canvas.offsetWidth
        //fijar medida vista canvas
        document.querySelector('.medidaAncho').textContent = 'x'
        document.querySelector('.medidaAlto').textContent = 'f(x)'
        //dibujar circulos
        const offsetInicial = 50
        this.dibujarCirculo( offsetInicial, this.alturaCanvas - offsetInicial )
        this.dibujarCirculo( this.anchoCanvas - offsetInicial, offsetInicial )

        //crear reticula
        this.crearReticula()

        //crear eventos para canvas
        this.canvas.addEventListener( "mousedown", this.marcarInicio )
        this.canvas.addEventListener( "mousemove", this.dibujarArco )
        this.canvas.addEventListener( "mouseup", this.finalizarTrazo )
        // this.canvas.ontouchstart = (ev) => this.marcarInicioCel(ev)
        // this.canvas.ontouchmove = (ev) => this.dibujarArcoCel(ev)
        // this.canvas.ontouchend = () => this.finalizarTrazo()
        this.btnRefrescar.onclick = () => location.reload()
        // this.btnSnapshot.onclick = () => this.takeCanvasSnapshot()
        // this.btnDescarga.onclick = () => this.downloadCanvasSnapshot()

    }

    dibujarCirculo( x, y ){
        this.ctx.beginPath()
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI)
        this.ctx.fillStyle = "green"
        this.ctx.fill()
        this.ctx.closePath()
    }

    crearReticula(){

        const numeroDivisiones = 10
        let espaciador = this.anchoCanvas / numeroDivisiones
        let iterador = espaciador

        for (let i = 0; i < numeroDivisiones - 1; i++) {
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
        this.ctx.closePath()
    }

    crearLineaHorizontal( y ){
        this.ctx.beginPath()
        this.ctx.moveTo( 0, y )
        this.ctx.lineTo( this.anchoCanvas, y )
        this.ctx.strokeStyle = "#e6791e"
        this.ctx.stroke()
        this.ctx.closePath()
    }

    marcarInicio = ( ev ) => {

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

    dibujarArco = ( ev ) => {

        if( !this.x1 || !this.y1 ) return

        const { offsetX: x, offsetY: y } = ev

        if( this.x1 == x ) return 

        this.puntitos.push({ x, y: this.alturaCanvas - y })
        this.ctx.moveTo( this.x1, this.y1 )
        this.ctx.lineTo( x, y )
        this.ctx.lineWidth = 5
        this.ctx.strokeStyle = "red"
        this.ctx.stroke()
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

    finalizarTrazo = () => {

        this.ctx.closePath()
        this.spResultado.textContent = this.calculaIntegral() + ' a.u.'
        this.canvas.removeEventListener("mousedown", this.marcarInicio )
        this.canvas.removeEventListener("mousemove", this.dibujarArco )
        this.canvas.removeEventListener("mouseup", this.finalizarTrazo )
    }

    calculaIntegral(){

        let suma = 0
        const expon = -2

        for( let i = 0; i < this.puntitos.length - 1; i++ ){

            let calculoDx = this.puntitos[i + 1].x - this.puntitos[i].x
            let caluclofp = (this.puntitos[i + 1].y -  this.puntitos[i].y) / calculoDx
            let calculoRaiz = Math.sqrt( caluclofp**2 + 1 )
            let calculoExp = (this.puntitos[i].y/this.alturaCanvas)**expon
            suma += calculoRaiz * calculoDx * calculoExp
        }

        return Math.floor(suma) 
    }

    takeCanvasSnapshot(){

        this.imgSnapshot.src = this.canvas.toDataURL()
    }

    downloadCanvasSnapshot(){
        
        const a = document.createElement('a')
        a.href = this.canvas.toDataURL()
        a.download = "arco.jpg"
        a.click()
    }
}

const lienzo = new Arco