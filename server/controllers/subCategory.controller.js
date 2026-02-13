// import SubCategoryModel from "../models/subCategory.model.js";

// export const AddSubCategoryController = async(request,response)=>{
//     try {
//         const { name, image, category } = request.body 

//         if(!name && !image && !category[0] ){
//             return response.status(400).json({
//                 message : "Provide name, image, category",
//                 error : true,
//                 success : false
//             })
//         }

//         const payload = {
//             name,
//             image,
//             category
//         }

//         const createSubCategory = new SubCategoryModel(payload)
//         const save = await createSubCategory.save()

//         return response.json({
//             message : "Sub Category Created",
//             data : save,
//             error : false,
//             success : true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

// export const getSubCategoryController = async(request,response)=>{
//     try {
//         const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
//         return response.json({
//             message : "Sub Category data",
//             data : data,
//             error : false,
//             success : true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

// export const updateSubCategoryController = async(request,response)=>{
//     try {
//         const { _id, name, image,category } = request.body 

//         const checkSub = await SubCategoryModel.findById(_id)

//         if(!checkSub){
//             return response.status(400).json({
//                 message : "Check your _id",
//                 error : true,
//                 success : false
//             })
//         }

//         const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
//             name,
//             image,
//             category
//         })

//         return response.json({
//             message : 'Updated Successfully',
//             data : updateSubCategory,
//             error : false,
//             success : true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false 
//         })
//     }
// }

// export const deleteSubCategoryController = async(request,response)=>{
//     try {
//         const { _id } = request.body 
//         console.log("Id",_id)
//         const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

//         return response.json({
//             message : "Delete successfully",
//             data : deleteSub,
//             error : false,
//             success : true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }


import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryController = async (request, response) => {
    try {
        const { name, image, category } = request.body;

        if (!name || !image || !category?.length) {
            return response.status(400).json({
                message: "Provide name, image, and category",
                error: true,
                success: false
            });
        }

        // ✅ Extract only ObjectId values from category array
        const categoryIds = category.map(cat => cat?._id ? cat._id : cat);

        const payload = {
            name,
            image,
            category: categoryIds
        };

        const createSubCategory = new SubCategoryModel(payload);
        const save = await createSubCategory.save();

        return response.json({
            message: "Sub Category Created",
            data: save,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getSubCategoryController = async (request, response) => {
    try {
        const data = await SubCategoryModel
            .find()
            .sort({ createdAt: -1 })
            .populate('category');

        return response.json({
            message: "Sub Category data",
            data,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateSubCategoryController = async (request, response) => {
    try {
        const { _id, name, image, category } = request.body;

        const checkSub = await SubCategoryModel.findById(_id);
        if (!checkSub) {
            return response.status(400).json({
                message: "Invalid SubCategory ID",
                error: true,
                success: false
            });
        }

        // ✅ Convert category array to array of ObjectIds
        const categoryIds = category.map(cat => cat?._id ? cat._id : cat);

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(
            _id,
            {
                name,
                image,
                category: categoryIds
            },
            { new: true } // returns updated doc
        );

        return response.json({
            message: "Updated Successfully",
            data: updateSubCategory,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteSubCategoryController = async (request, response) => {
    try {
        const { _id } = request.body;
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);

        if (!deleteSub) {
            return response.status(404).json({
                message: "SubCategory not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Deleted successfully",
            data: deleteSub,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
