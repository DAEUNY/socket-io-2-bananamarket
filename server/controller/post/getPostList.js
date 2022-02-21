const { Op } = require("sequelize");
const { Article, Category, User, UserArticles } = require('../../models');
const { checkAccessToken } = require("../tokenFunction");
// const { Post } = require('../../models')

module.exports = async (req, res) => {

  const { search, category, isHost, sort } = req.query
  const page = req.query.page || 0;
  const limit = 10;
  const offset = page * limit

  // 1. category query만 있는 경우
  if (category) {
    let listByCategory = await Category.findAndCountAll({
      where : {
        food_type : category
      },
      include : [{
        model : Article
      }]
    })

    const articleCount = listByCategory.count
    // 1. 카테고리에 해당하는 article이 없다면
    if (articleCount === 0) {
      return res.status(200).json({message: 'Article Is Empty!'})
    }
    // 1. 존재하는 article 수 * 페이지를 벗어나는 페이지를 요구한 경우
    else if (articleCount < offset) {
      return res.status(200).json({
        data : {
          articleList : []
        },
        message : 'No more articles'
      })
    }
  
  // 1. 카테고리 리스트 전달
    listByCategory = await listByCategory.rows[0].getArticles({
      limit: limit,
      offset: offset,      
      attributes : ['id', 'title', 'image', 'market', 'date', 'time', ['total_mate', 'totalMate'], ['current_mate', 'currentMate'], ['trade_type', 'tradeType'], 'status'],
      order : [['createdAt', 'DESC']]
    })
    return res.status(200).json({
      data : {
        articleList : listByCategory
      },
      message : `${articleCount} articles in '${category}' category`
    })
  }

  // 2. 검색어 입력
  if (search) {
    const listBySearch = await Article.findAndCountAll({
      limit: limit,
      offset: offset,      
      where : {
        title : {
          [Op.substring]: search
        }
      },
      attributes : ['id', 'title', 'image', 'market', 'date', 'time', ['total_mate', 'totalMate'], ['current_mate', 'currentMate'], ['trade_type', 'tradeType'], 'status'],
      order : [['createdAt', 'DESC']]
    })

    const articleCount = listBySearch.count
    // 2. 검색 결과가 없는 경우
    if (articleCount === 0) {
      return res.status(200).json({message: 'No results found!'})
    }
    // 2. 존재하는 article 수 * 페이지를 벗어나는 페이지를 요구한 경우
    else if (articleCount < offset) {
      return res.status(200).send({
        data : {
          articleList : []
        },
        message : 'No more articles'
      })
    }
    // 2. 전체 리스트 전달
    return res.status(200).json({
      data : {
        articleList : listBySearch.rows
      },
      message : `About ${articleCount} results found`
    })
  }
  
  // 3. 내가 참여한 게시글 목록
  if (isHost === 'true, false') {
    const accessTokenData = checkAccessToken(req);
    // 3. 토큰이 유효하지 않은 경우
    if (!accessTokenData) {
      res.status(401).send({ message: "Not authorized" });
    }
    const { id } = accessTokenData;

    let userArticleList = await User.findAndCountAll({
      where : {
        id : id
      },
      include: Article
    })

    const articleCount = userArticleList.count
    // 3. 해당 유저가 참여한 article이 없다면
    if (articleCount === 0) {
      return res.status(200).json({message: 'Article Is Empty!'})
    }
    // 3. 존재하는 article 수 * 페이지를 벗어나는 페이지를 요구한 경우
    else if (articleCount < offset) {
      return res.status(200).json({
        data : {
          articleList : []
        },
        message : 'No more articles'
      })
    }

    // 3. 유저 참여 리스트 전달
    userArticleList = await userArticleList.rows[0].getArticles({
    limit: limit,
    offset: offset,      
    attributes : ['id', 'title', 'image', 'market', 'date', 'time', ['total_mate', 'totalMate'], ['current_mate', 'currentMate'], ['trade_type', 'tradeType'], 'status'],
    joinTableAttributes : [],
    order : [['createdAt', 'DESC']]
    });

    const myArticleList = await Promise.all(
      userArticleList.map(article => {
        article = article.toJSON()
        const resData = {
          userId : id,
          ...article
        }
        return resData
      })
    )

    return res.status(200).json({
      data : {
        articleList : myArticleList
      },
      message : `Total ${articleCount} articles you have joined`
    })
  }

  // 4. 내가 작성한 게시글 목록
  if (isHost === 'true') {
    const accessTokenData = checkAccessToken(req);

    if (!accessTokenData) {
      res.status(401).send({ message: "Not authorized" });
    }
    const { id } = accessTokenData;

    let userUploadList = await User.findAndCountAll({
      where : {
        id : id
      },
      include : [{
        model : Article,
        through : {
          where : {
            is_host : true
          }
        }
      }]
    })

    const articleCount = userUploadList.count
    // 4. 해당 유저가 작성한 article이 없다면
    if (articleCount === 0) {
      return res.status(200).json({message: 'Article Is Empty!'})
    }
    // 4. 존재하는 article 수 * 페이지를 벗어나는 페이지를 요구한 경우
    else if (articleCount < offset) {
      return res.status(200).json({
        data : {
          articleList : []
        },
        message : 'No more articles'
      })
    }

    // 4. 유저 작성 리스트 전달
    userUploadList = await userUploadList.rows[0].getArticles({
      limit: limit,
      offset: offset,      
      attributes : ['id', 'title', 'image', 'market', 'date', 'time', ['total_mate', 'totalMate'], ['current_mate', 'currentMate'], ['trade_type', 'tradeType'], 'status'],
      order : [['createdAt', 'DESC']],
      joinTableAttributes : [],
      through : {
        where : {
          is_host : true
        },
        attributes : []
      }
    })

    const myUploadList = await Promise.all(
      userUploadList.map((article) => {
        article = article.toJSON()
        const resData = {
          userId : id,
          ...article
        }
        return resData
      })
    )

    return res.status(200).json({
      data : {
        articleList : myUploadList
      },
      message : `Total ${articleCount} articles you have uploaded`
    })
  }

  // 5. sort query만 있는 경우, 리스트 전체 전달
  if (sort) {
    // 5-1. 마감 기한 순 전체 정렬
    if (sort === 'due-date') {
      const allListOrderByDuedate = await Article.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes : ['id', 'title', 'image', 'market', 'date', 'time', ['total_mate', 'totalMate'], ['current_mate', 'currentMate'], ['trade_type', 'tradeType'], 'status'],
        // where : {
        //   date : {
        //     [Op.gt]: new Date()
        //   },
        //   status : true
        // },
        order: [['date'], ['time', 'DESC'], ['createdAt']],
      }).catch(e => console.log(err))

      const articleCount = allListOrderByDuedate.count;
      
      // 5-1. article이 없다면
      if (articleCount === 0) {
        return res.status(200).json({message: 'Article Is Empty!'})
      }
      // 5-1. 존재하는 article 수 * 페이지를 벗어나는 페이지를 요구한 경우
      else if (articleCount < offset) {
        return res.status(200).send({message : 'No more articles'})
      }
      // 5-1. 전체 리스트 응답
      return res.status(200).json({
        data : {
          articleList : allListOrderByDuedate.rows
        },
        message : `Total ${articleCount} articles ordered by due-date, time and new`
      })
    }
  }

  // 6. 업로드 순 전체 정렬 (default)
  const allListOrderByUpload = await Article.findAndCountAll({
    limit: limit,
    offset: offset,
    attributes : ['id', 'title', 'image', 'market', 'date', 'time', ['total_mate', 'totalMate'], ['current_mate', 'currentMate'], ['trade_type', 'tradeType'], 'status'],
    order: [['createdAt', 'DESC']],
  }).catch(e => console.log(err))

  const articleCount = allListOrderByUpload.count;

  // 6-2. article이 없다면
  if (articleCount === 0) {
    return res.status(200).json({message: 'Article Is Empty!'})
  }
  // 6-2. 존재하는 article 수 * 페이지를 벗어나는 페이지를 요구한 경우
  else if (articleCount < offset) {
    return res.status(200).send({
      data : {
        articleList : []
      },
      message : 'No more articles'
    })
  }
  // 6-2. 전체 리스트 전달
  return res.status(200).json({
    data : {
      articleList : allListOrderByUpload.rows
    },
    message : `Total ${articleCount} articles ordered by upload`
  })
};



