const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");
const multer  = require('multer');
const path = require('path');
const fs = require('fs')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
//app.use(bodyParser.urlencoded({ extended:  }));

//app.use(bodyParser.text());
app.use(cors());
app.use('/uploads', express.static('uploads'));


const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    language: {
        type: String
    }

})


const formModel = mongoose.model('formModel', formSchema);

mongoose.connect('mongodb+srv://Admin:Admin123@cluster0.byhwwxz.mongodb.net/?retryWrites=true&w=majority')
    .then(function (db) {
        console.log("database connected")
    })
    .catch(function (err) {
        console.log(err)
    })


const translationSchema = new mongoose.Schema({
    lang:String,
    foor : {
      language: String,
      name: String,
      email: String,
      submit: String,
      image: String,
    }
});
    
const Trans = mongoose.model('Trans',translationSchema)


    const storage = multer.diskStorage({
        destination: 
        function (req, file, cb) {
          cb(null, path.join(__dirname, './uploads'))
        }
        ,
        filename: function (req, file, cb) {
          cb(null, file.originalname)
        }
    })
    const upload = multer({storage: storage})

 app.post("/login",upload.single('image'), async function (req, res) {
   // console.log(req.body)
    let data = await req.body.data;
    const k = "i123";
    const Dycriptdata = {};
    // const Dycriptdata = {
    //     name: CryptoJS.AES.decrypt(data.name, key).toString(CryptoJS.enc.Utf8),
    //     email: CryptoJS.AES.decrypt(data.email, key).toString(CryptoJS.enc.Utf8),
    //     language: CryptoJS.AES.decrypt(data.language, key).toString(CryptoJS.enc.Utf8),    
    // }

       if(req.body.image){
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
      
        const filePath = path.join(__dirname, 'uploads');
        fs.writeFile(filePath, imageBuffer, function (err) {
          if (err) {
            console.log('Error aa gya :', err);
          }
        });
    }


   // for(let key in data){
    //  const Decryptkey = CryptoJS.AES.decrypt(key,k).toString(CryptoJS.enc.Utf8);
    //  const DecryptValue = CryptoJS.AES.decrypt(data[key],k).toString(CryptoJS.enc.Utf8);
    //  Dycriptdata[Decryptkey]=DecryptValue;
    // }


   // console.log(data)
    const decryptedBytes = CryptoJS.AES.decrypt(data,k);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedJson = JSON.parse(decryptedString);


    let user = await formModel.create(decryptedJson);
    console.log(data);
    res.json({
        massage: "this is inserted in the database"
    })
})






app.get('/translations/:lang', async function (req, res) {
  // res.send("goood")
  const l = req.params.lang;
  console.log(`api call for lang:${l} `)
  try{
  // mongoose.connect('mongodb+srv://Admin:Admin123@cluster0.byhwwxz.mongodb.net/translation_db?retryWrites=true&w=majority');

  // const transCollection = await mongoose.connection.collection('translation');
  const translation = await Trans.findOne({ lang: l });
  // const t = await transCollection.findOne({lang: l});
  // const f = await t.foor
  if(!translation){
    res.send("not a valid language")
  }else{
    res.json({foor:translation.foor})
  }


  }catch(error){
    console.log(error)
    res.status(500).json({message:"their is some error in recognisation of language from database."})
  } 
});







app.listen(3000, () => {
    console.log("server is running")
})


/*

var uploadFnct = function () {

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        var folder = req.body.folder
        if (folder) {
          checkDirectory('./uploads/' + folder, function (error) {
            if (error) {
              console.log("oh no!!!", error);
            } else {
              //Carry on, all good, directory exists / created.
              cb(null, './uploads/' + folder + '/');
            }
          });
  
        }
      },
      filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        //cb(null, +Date.now()+`_${file.originalname}`)
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
      }
    });
  
    var upload = multer({ //multer settings
      storage: storage
    }).single('file');
  
    return upload;
  };
  */