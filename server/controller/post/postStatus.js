
const { Article } = require('../../models')

module.exports = async (req, res) => {

  const articleId = req.params.articleid

  // 요청 id를 보내지 않았으면
  if (!articleId) {
    res.status(400).json({message:'No article id'})
  }

  let article = await Article.findOne({
    where : {
      id : articleId
    }
  }).catch(e => console.log(e))

  // 요청한 id와 일치하는 게시글이 없으면
  if (!article) {
    res.status(404).send({message:`Article with id '${articleId}' not found`})
  }

  // 상태가 1이면 (true이면) false로 상태 변경
  if (article.status) {
    const updateStatus = await article.update({
      status: false
    })
    res.status(200).json({
      data : {
        article : {
          status : updateStatus.status
        }
      }, 
      message : 'ok'
    })
  }
  // 상태가 0이면 (false) true로 상태 변경
  else if (article.status === false) {    
    const updateStatus = await article.update({
      status: true
    })
    res.status(200).json({
      data : {
        article : {
          status : updateStatus.status
        }
      }, 
      message : 'ok'
    })
  }

};
