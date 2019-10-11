const fs = require('fs')
const path = require('path')

const exiftool = require('exiftool-vendored').exiftool

const input = process.argv

const testImage = __dirname + '/image/test.jpg'

if (input[2]) {
  if (path.extname(input[2]) == '') {
    console.log('input is directory')
    const inputList = fs.readdirSync(input[2])
    console.log(inputList)
    inputList.forEach(image => {
      console.log(image)
      rename(input[2] + image)
    })
  } else {
    console.log('input is file')
    inputImage = input[2]
    rename(inputImage)
  }
} else {
  inputImage = testImage
  rename(inputImage)
}

function rename (inputImage) {
  const base = path.basename(inputImage)
  const ext = path.extname(inputImage)
  const name = path.basename(inputImage, ext)
  if (ext == '') {
    return 0
  }
  exiftool
    .read(inputImage)
    .then(tags => {
      console.log(tags.FileName + ' has been loaded.')

      const date =
        tags.FileModifyDate.year.toString() +
        tags.FileModifyDate.month +
        tags.FileModifyDate.day +
        tags.FileModifyDate.hour +
        tags.FileModifyDate.minute +
        tags.FileModifyDate.second +
        tags.FileModifyDate.millisecond
      console.log('renamed into ' + date + ext)
      fs.copyFile(inputImage, date + ext, result => {
        exiftool.end()
      })
    })
    .catch(err => console.error('Something terrible happened: ', err))
}
