const express = require('express')

const backend = express()

backend.listen(4000, () => {
    console.log('listening on port 4000')
}
)