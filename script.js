const canvas = document.querySelector('#canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth-250
canvas.height = window.innerHeight

window.addEventListener('resize', (e)=>{
    canvas.width = window.innerWidth-250
    canvas.height = window.innerHeight
})

const states = {
    drawing:true,

    gravitation:true,
    gravitationSpeed:0,
    generatedParticlesAmount:3,

    rotating:false,
    rotatingSpeed:0.1,

    shadow:true,
    stroke:false,
    strokeColor:true,
    rainbowColor:true,
    colorR:255,
    colorG:0,
    colorB:0,
    color:function(){
        return `rgba(${this.colorR},${this.colorG},${this.colorB})`
    },


    randomSize:false,
    size:13,
    resize:true,

    shape:1

}


let xPosition = 0
let yPosition = 0

let mouseDown = false

window.addEventListener('mousemove', (e)=>{
    const xMousePosition = e.x
    const yMousePosition = e.y
    if(mouseDown) {


        /** dokreslení partiklů mezi */
        const particleSize = states.size<15?states.size:states.size/2

        const distance = Math.sqrt(Math.pow(xMousePosition-xPosition,2)+Math.pow(yMousePosition-yPosition,2))
        const xDistanceBetweenPoint = (xMousePosition-xPosition)/(distance/particleSize)
        const yDistanceBetweenPoint = (yMousePosition-yPosition)/(distance/particleSize)


        const numberOfObjects = Math.round(distance/particleSize)
        if(numberOfObjects>0){
            for(let i = 0; i <= distance; i += particleSize){
            fillParticleArray()

            xPosition = xPosition + xDistanceBetweenPoint
            yPosition = yPosition + yDistanceBetweenPoint
        }
        }
        /** dokreslení partiklů mezi */

    
    xPosition = xMousePosition
    yPosition = yMousePosition
    fillParticleArray()
    }
})

canvas.addEventListener('mousedown',(e)=>{
    mouseDown = true
    xPosition=e.x
    yPosition=e.y
    fillParticleArray()
    
})
canvas.addEventListener('mouseup',(e)=>{
    mouseDown = false
})








class Particle{
    constructor(){
        this.x = xPosition
        this.y = yPosition
        this.speedX = Math.random()*4-2
        this.speedY = Math.random()*4-2
        this.size = (states.randomSize)? Math.random()*states.size+states.size/2 :states.size
        this.angle = angle
        this.color = (states.rainbowColor)?`hsl(${hue},100%,50%)`: states.color()
        this.strokeColor = states.strokeColor?'#000':'#fff'

        this.n = 6
        this.inset = 0.5
    }
    draw(){
        
        c.fillStyle = this.color
        c.strokeStyle = this.strokeColor
        c.shadowBlur = 20 + this.size/25
        if(states.shadow){
            c.shadowColor = 'rgba(0,0,0,0.3)'
        }else c.shadowColor = 'rgba(0,0,0,0)'
        
        
        c.beginPath()
        c.save()
        c.translate(this.x,this.y)
        
        c.rotate(this.angle)
        

        switch(states.shape){
            case 0:
                c.rect(-this.size/2, -this.size/2,this.size,this.size)
                break
            case 1:
                c.arc(0, 0, this.size/2, 0, 2 * Math.PI)
                break
            case 2:
                c.moveTo(0, 0 - this.size/2)
                for(let i = 0;i<this.n;i++){
                    c.rotate(Math.PI/this.n)
                    c.lineTo(0, 0 - ((this.size/2)*this.inset))
                    c.rotate(Math.PI/this.n)
                    c.lineTo(0, 0 - this.size/2)
                }
                break
            case 3:
                this.n = 3
                this.inset = 1
                c.moveTo(0, 0 - this.size/2)
                for(let i = 0;i<this.n;i++){
                    c.rotate(Math.PI/this.n)
                    c.lineTo(0, 0 - ((this.size/2)*this.inset))
                    c.rotate(Math.PI/this.n)
                    c.lineTo(0, 0 - this.size/2)
                }
                break
        }
        c.restore()
        c.fill()
        if(states.stroke)c.stroke()
    }
    update(){
        if(states.rotating) this.angle += states.rotatingSpeed/2
        if(states.resize && (!states.drawing || states.gravitation)) this.size -=0.3+this.size/20
        if(states.gravitation) {
            this.x +=this.speedX
            this.y +=this.speedY
            this.speedY += states.gravitationSpeed

        }

    }
}


let angle = 0
let hue = 0
let smallestParticle = states.size/2
const particleArray = []
const fillParticleArray = ()=>{
    if(states.rainbowColor) hue+=1.5
    if(states.rotating) angle += states.rotatingSpeed

    for(let i = states.generatedParticlesAmount;i>0;i--){
        particleArray.push(new Particle())
    }
}
const particleCreate = ()=>{
    particleArray.forEach((oneParticle, index)=>{
        oneParticle.draw()
        oneParticle.update()
        
        if(states.resize && (!states.drawing || states.gravitation)){
        if(oneParticle.size<=smallestParticle || oneParticle.size<=2) particleArray.splice(index, 1)
        }else particleArray.splice(index, 1)

    })

}



const animate = ()=>{
    window.requestAnimationFrame(animate)
    if(!states.drawing)c.clearRect(0,0, canvas.clientWidth, canvas.height)
    if(!states.rotating && angle !== 0) angle = 0

// při větším počtu generovaných partiklů partikly budou mizet rychleji
    if(particleArray.length<2000)smallestParticle = states.size/8
    if(particleArray.length>2000)smallestParticle = states.size/5
    if(particleArray.length>3000)smallestParticle = states.size/3
    if(particleArray.length>4000)smallestParticle = states.size


    particleCreate()
}
animate()








const drawingModeSwitch = document.querySelector('.drawing-mode-switch')
drawingModeSwitch.addEventListener('change', (e)=>{
    states.drawing = e.target.checked
})

const colorPreview = document.querySelector('.color')
const sliderBarColorR = document.querySelector('.R-color-slider-bar')
sliderBarColorR.addEventListener('change', (e)=>{
    sliderBarColorR.style.backgroundColor = `rgba(${e.target.value/2+127.5},0,0)`
    states.colorR = e.target.value
    colorPreview.style.backgroundColor = states.color()
})
const sliderBarColorG = document.querySelector('.G-color-slider-bar')
sliderBarColorG.addEventListener('change', (e)=>{
    sliderBarColorG.style.backgroundColor = `rgba(0,${e.target.value/2+127.5},0)`
    states.colorG = e.target.value
    colorPreview.style.backgroundColor = states.color()

})
const sliderBarColorB = document.querySelector('.B-color-slider-bar')
sliderBarColorB.addEventListener('change', (e)=>{
    sliderBarColorB.style.backgroundColor = `rgba(0,0,${e.target.value/2+127.5})`
    states.colorB = e.target.value
    colorPreview.style.backgroundColor = states.color()

})

const rainbowSwitch = document.querySelector('.rainbow-switch')
rainbowSwitch.addEventListener('change', (e)=>{
    states.rainbowColor = e.target.checked
})



const strokeSwitch = document.querySelector('.stroke-switch')
strokeSwitch.addEventListener('change', (e)=>{
    states.stroke = e.target.checked
})


const strokeColorSwitch = document.querySelector('.stroke-color-switch')
strokeColorSwitch.addEventListener('change', (e)=>{
    states.strokeColor = e.target.checked
})

const shadowSwitch = document.querySelector('.shadow-switch')
shadowSwitch.addEventListener('change', (e)=>{
    states.shadow = e.target.checked
})


const sliderBarSize = document.querySelector('.size-slider-bar')
sliderBarSize.addEventListener('change', (e)=>{
    states.size = Number(e.target.value)
})


const randomSizeSwitch = document.querySelector('.random-size-switch')
randomSizeSwitch.addEventListener('change', (e)=>{
    states.randomSize = e.target.checked
})

const resizeSwitch = document.querySelector('.resize-switch')
resizeSwitch.addEventListener('change', (e)=>{
    states.resize = e.target.checked
})

const gravitationSwitch = document.querySelector('.gravitation-switch')
gravitationSwitch.addEventListener('change', (e)=>{
    states.gravitation = e.target.checked
})

const sliderBarGravitationSpeed = document.querySelector('.gravitation-speed-slider-bar')
sliderBarGravitationSpeed.addEventListener('change', (e)=>{
    states.gravitationSpeed = e.target.value/1000
})

const rotationSwitch = document.querySelector('.rotation-switch')
rotationSwitch.addEventListener('change', (e)=>{
    states.rotating = e.target.checked
})

const sliderBarRotationSpeed = document.querySelector('.rotation-speed-slider-bar')
sliderBarRotationSpeed.addEventListener('change', (e)=>{
    states.rotatingSpeed = e.target.value/1000
})


const sliderBarGeneratedParticlesAmount = document.querySelector('.generated-particles-amount-slider-bar')
sliderBarGeneratedParticlesAmount.addEventListener('change', (e)=>{
    states.generatedParticlesAmount = e.target.value
})


const shapes = document.querySelectorAll('.shape-button')
shapes.forEach((oneShape, index)=>{
    oneShape.addEventListener('click', ()=>{
        shapes.forEach((oneShape)=>oneShape.classList.remove('active'))
        oneShape.classList.add('active')
        states.shape = index
    })
})