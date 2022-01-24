function PyramidError(message) {
    this.message = message
}

class Pyramid {
    blocksCarryNum = 6
    constructor(elapsedTime, blockLoadTime, blockUnloadTime, boatsNum, distanceTime) {
        if (elapsedTime < 1 || blockLoadTime < 1 || blockUnloadTime < 1 || boatsNum < 1 || distanceTime < 1) {
            throw new PyramidError('Incorrect input parameter detected')
        }

        this.elapsedTime = elapsedTime

        this.deliveredStonesNum = 0
        this.boatCircleTime = (distanceTime * 2) + (blockLoadTime * this.blocksCarryNum) + (blockUnloadTime * this.blocksCarryNum)
        this.boatIndex = -1

        this.actions = [
            {
                name: 'Boat Travel: Capital => Mining site',
                distanceTime,
                method: 'travel'
            },
            {
                name: 'Load Stone',
                blockLoadTime,
                method: 'loadUnloadBlocks'
            },
            {
                name: 'Boat Travel: Mining site => Capital',
                distanceTime,
                method: 'travel'
            },
            {
                name: 'Unload Stone',
                blockUnloadTime,
                method: 'loadUnloadBlocks'
            }
        ]

        this.boats = (function() {
            const boats = []
            let counter = boatsNum
            while(counter > 0) {
                counter --
                const boat = {
                    name: 'Boat ' + (boatsNum - counter)
                }
                boats.push(boat)
            }
            return boats
        })()

        this.logs = []
    }

    functions = {
        loadUnloadBlocks: (boats, action) => {
            let counter = boats.length
            while(counter > 0 && this.elapsedTime > 0) {
                counter --
                const index = Math.abs(counter - boats.length) - 1
    
                let spentTime = 0, blockCounter = this.blocksCarryNum, successBlocksNum = 0
                while(blockCounter > 0 && this.elapsedTime > 0) {
                    blockCounter --
                    successBlocksNum ++
                    if (action.name === 'Load Stone') {
                        spentTime += action.blockLoadTime
                        this.elapsedTime -= action.blockLoadTime
                    } else if (action.name === 'Unload Stone') {
                        spentTime += action.blockUnloadTime
                        this.deliveredStonesNum ++
                        this.elapsedTime -= action.blockUnloadTime
                    }
                }
    
                const data = {
                    action: action.name,
                    boat: boats[index].name,
                    spentTime,
                    stonesNum: successBlocksNum,
                    elapsedTime: this.elapsedTime
                }
    
                this.logs.push(data)
            }    
        },
        travel: (boats, action) => {
            let counter = boats.length
            while(counter > 0 && this.elapsedTime > 0) {
                counter --
                const index = Math.abs(counter - boats.length) - 1
    
                this.elapsedTime -= action.distanceTime
    
                const data = {
                    action: action.name,
                    boat: boats[index].name,
                    elapsedTime: this.elapsedTime
                }
    
                this.logs.push(data)
            }    
        },
        boatsMapping: () => {
            const boats = []
            let counter = this.elapsedTime >= (this.boatCircleTime * 2) ? 2 : 1
            while (counter > 0) {
                counter --
                if (this.boatIndex === (this.boats.length - 1)) {
                    this.boatIndex = 0
                } else {
                    this.boatIndex ++
                }
                boats.push(this.boats[this.boatIndex])
            }
            return boats
        },
        recurse: () => {
            if (this.elapsedTime >= this.boatCircleTime) {
                const boats = this.functions.boatsMapping()
                let counter = this.actions.length
                while(counter > 0) {
                    counter --
        
                    const index = Math.abs(counter - this.actions.length) - 1
                    const action = this.actions[index]
        
                    this.functions[action.method](boats, action)
                }
                
                if (this.elapsedTime >= this.boatCircleTime) {
                    this.functions.recurse()
                }
            }
        }
    }

    start() {
        this.functions.recurse()
    }
}

export default Pyramid