const multer = require('multer')

// upload product image 
// diskStorage >>property in multer and it is palce which is multer store image into 
// it take object which has two props >> destination and filename 
// 1-destination >> take fun ( cb >> callbacke fun) 
// cb >> take two params >> 1- err 2- path 
// 2 - filename 
// cb >> take two params >> 1- err 2- filename  

const uploadImages = ()=>{
    const MimeType = {
        'image/jpg': 'jpg',
        'image/jpeg':'jpeg',
        'image/png':'png'
    }
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
           
          cb(null, 'public/uploads')
        },
        filename: function (req, file, cb) {
            const extension = MimeType[file.mimetype]
           let ImageError = null
           if(!extension)  ImageError =  new Error('not valid image!')
           
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(ImageError, file.originalname + '-' + uniqueSuffix + '.'+ extension)
        }
      })
      // then we pass storge as a value to storege prop 
      const upload = multer({ storage: storage });
      return upload;
     
}

module.exports =  {uploadImages}