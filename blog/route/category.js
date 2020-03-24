const express = require('express');
const router = express.Router();
const categoryModel = require('../modules/category.js');
const pagination = require('../util/pagination.js');
// 权限验证：
router.use((req,res,next)=>{
    if(req.userInfo.isAdmin){
        next()
    }else{
        res.send('<h1>请用管理员账号登录</h1>');
        return;
    }
})

// 显示分类管理页面：
router.get('/',(req,res)=>{
    const options = {
        page:req.query.page,
        model:categoryModel,
        projection:' -__v',
        query:{},
        sort:{orderd:1}
    }

    pagination(options)
    .then(data=>{
        res.render('admin/category-list.html',{
            userInfo:req.userInfo,
            categories:data.users,
            page:data.page,
            pages:data.pages,
            list:data.list,
            url:'/category',
        })
    })
    .catch(err=>{
        throw err;
    })

    // res.render('admin/category-list.html',{
    //     userInfo:req.userInfo
    // });
});

// 显示新增分类页面
router.get('/add',(req,res)=>{
    res.render('admin/category-add.html',{
        userInfo:req.userInfo
    });
});

// 向后台添加数据逻辑页面：
router.post('/add',(req,res)=>{
    const {name,order} = req.body;
    categoryModel.findOne({name})
    .then(categories=>{
        if(!categories){ // 新增分类成功
            categoryModel.insertMany({name,order})
            .then(categories=>{ 
                res.render('admin/success.html',{
                    userInfo:req.userInfo,
                    url:'/category'
                });
            })
            .catch(err=>{
                res.render('admin/error.html',{
                    userInfo:req.userInfo,
                    msg:'操作数据库出错，请稍后再试'
                });
            })
        }else{ // 新增分类失败，数据库里内容已经存在
            res.render('admin/error.html',{
                userInfo:req.userInfo,
                msg:'分类名称已存在，请重新输入!'
            });
        }
    })
    .catch((err)=>{
        res.render('admin/error.html',{
            userInfo:req.userInfo,
            msg:'操作数据库出错，请稍后再试'
        });
    })

});

// 编辑分类
router.get('/edit/:id',(req,res)=>{
    const { id } = req.params;
    categoryModel.findById(id)
    .then(category=>{
        res.render('admin/category-edit.html',{
            userInfo:req.userInfo,
            name:category.name,
            order:category.order,
            id:category._id // 传id到hidden的input框
        });
    })
})

// 删除分页
router.post('/edit',(req,res)=>{
    const {name,order,id} = req.body;
    console.log(name,order,id);
})
module.exports = router;