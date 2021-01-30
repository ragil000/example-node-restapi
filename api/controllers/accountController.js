const Account = require('../models/accountModel')
const sanitize = require('mongo-sanitize')
const bcrypt = require('bcrypt')
const ObjectId = require('mongoose').Types.ObjectId

exports.account_get = async (request, response, next) => {
    const page = sanitize(request.params.page) ? sanitize(request.params.page) : 1
    const limit = sanitize(request.params.limit) ? sanitize(request.params.limit) : 10

    try {
        const getData = await Account.paginate({}, { page: page, limit: limit })
        
        if(getData.docs.length) {
            response.status(200).json({
                status: true,
                message: 'data berhasil diambil',
                data: getData.docs.map((account) => {
                    return {
                        _id: account._id,
                        username: account.username,
                        email: account.email
                    }
                }),
                totalData: getData.totalDocs,
                limit: getData.limit,
                totalPages: getData.totalPages,
                page: getData.page,
                pageLink: {
                    baseLink: `${process.env.BASE_URL}/accounts/`,
                    exampleLink: `${process.env.BASE_URL}/accounts/1`,
                    method: 'GET'
                },
                hasPrevPage: getData.hasPrevPage,
                hasNextPage: getData.hasNextPage,
                prevPage: getData.prevPage,
                nextPage: getData.nextPage
            })
        }else {
            response.status(200).json({
                status: false,
                message: 'data kosong'
            })
        }
    }catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_detailsGet = async (request, response, next) => {
    try {
        const _id = sanitize(request.params.id)
        
        if(ObjectId.isValid(_id)) {
            const getData = await Account.findOne({ _id: _id })

            if(getData) {
                response.status(200).json({
                    status: true,
                    message: 'detail data berhasil ditampilkan',
                    data: {
                        _id: getData._id,
                        username: getData.username,
                        email: getData.email
                    }
                })
            }else {
                response.status(200).json({
                    status: false,
                    message: 'detail data tidak ditemukan'
                })
            }
        }else {
            response.status(200).json({
                status: false,
                message: 'detail data tidak ditemukan, karena id bukan ObjectId'
            })
        }
    }catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_post = async (request, response, next) => {
    try {
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(request.body.password, salt)
        
        const create = await Account.create({
            username: sanitize(request.body.username),
            email: sanitize(request.body.email),
            password: passwordHash
        })

        return response.status(201).json({
            status: true,
            message: 'data berhasil ditambahkan',
            data: create
        })
    }catch(error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_put = async (request, response, next) => {
    try {
        const _id = sanitize(request.params.id)
        
        if(ObjectId.isValid(_id)) {
            const findAccount = await Account.findOne({ _id: _id })
            if(findAccount) {
                let updateData = {}
                if(request.body.password) {
                    const salt = await bcrypt.genSalt()
                    const passwordHash = await bcrypt.hash(request.body.password, salt)
                    updateData = {
                        username: sanitize(request.body.username),
                        email: sanitize(request.body.email),
                        password: passwordHash
                    }
                }else {
                    updateData = {
                        username: sanitize(request.body.username),
                        email: sanitize(request.body.email)
                    }
                }

                const update = await Account.updateOne({ _id: _id }, { $set: updateData })
                response.status(200).json({
                    status: true,
                    message: 'data berhasil diupdate'
                })
            }else {
                response.status(200).json({
                    status: false,
                    message: `data dengan id: ${_id} tidak ditemukan`
                })
            }
        }else {
            response.status(200).json({
                status: false,
                message: `id: ${_id} bukan ObjectId`
            })
        }
    }catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}

exports.account_delete = async (request, response, next) => {
    try {
        const _id = sanitize(request.params.id)
        
        if(ObjectId.isValid(_id)) {
            const findAccount = await Account.findOne({ _id: _id })
            if(findAccount) {
                const destroy = await Account.deleteOne({ _id: _id })
                if(destroy) {
                    response.status(200).json({
                        status: true,
                        messsage: 'data berhasil dihapus'
                    })
                }else {
                    response.status(200).json({
                        status: false,
                        messsage: 'data gagal dihapus'
                    })
                }
            }else {
                response.status(200).json({
                    status: false,
                    message: `data dengan id: ${_id} tidak ditemukan`
                })
            }
        }else {
            response.status(200).json({
                status: false,
                message: `id: ${_id} bukan ObjectId`
            })
        }
    }catch (error) {
        return response.status(500).json({
            status: false,
            message: error.message
        })
    }
}