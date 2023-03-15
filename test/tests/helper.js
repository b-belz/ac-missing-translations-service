const _ = require('lodash')


/**
 * The next 2 function auto-create expected properties based on APIdoc definitions
 * 
 */

const prepareExpectedProperties = (params) => {
  const action = _.get(params, 'action', 'response')
  const data = _.get(params, 'data')
  const fieldDefs = _.get(params, 'fieldDefs')
  const fields = _.get(params, 'fields')
  _.forEach(fieldDefs, field => {
    if (_.indexOf(field.actions, action) > -1 || !_.size(field.actions)) {
      let item = {
        field: field.field,
        type: field.type
      }
      if (_.get(params, 'path')) _.set(item, 'path', _.get(params, 'path'))
      if (field.nullAllowed) _.set(item, 'nullAllowed', true)
      if (field.missingAllowed) _.set(item, 'missingAllowed', true)
      if (_.get(data, field.field)) {
        _.set(item, 'value', _.get(data, field.field))
      }
      fields.push(item)
      // TODO: Check properties - BUT - they can also not exists (e.g. settings.bgColor is optional for templates!)
      // set missingAllowed true in APIdoc (similar to null allowed)
    }
  })
  return fields
}

const expectedPropertiesFromAPIdocs = (params) => {
  const model = _.get(params, 'controller')
  if (!model) return []
  
  const apiDoc = require('../../config/apiDoc/' + model)
  const fields = prepareExpectedProperties({
    action: _.get(params, 'action', 'response'),
    data:  _.get(params, 'data'),
    fieldDefs: _.get(apiDoc, `apiDoc.${model}.fields`),
    fields: []
  })
  //console.log(455, fields)
  return fields
}  

/*
* Checks a given object for properties
*
* @param params.expectedProperties ARRAY array of fields/values to check
* @param params.objectToCheck OBJECT The object to check (usually res.body)
* @param params.data OBJ OPTIONAL Object of data send to the API - should be in the response
*
* EXPECTED PROPERTIES OBJECT
* @param field STRING field to check
* @param value STRING/ARRAY/INT/OBJECT OPT value to check the field for
* @param length INT OPT length of an array
*
* Example
   let expectedProperties = [
     { field: 'message', value: 'error_dropsitedelivery_createmedia_requiredMetadataMissing' },
     { field: 'title', path: 'additionalInfo', value: 'meta_editor'} // checks for title.additionalINnfo
   ]
   helper.propertiesAndValues({ expectedProperties, objectToCheck: res.body })
*
*/

const propertiesAndValues = (params) => {
 const expectedProperties = _.get(params, 'expectedProperties', expectedPropertiesFromAPIdocs({ controller: _.get(params, 'controller'), action: _.get(params, 'action'), data: _.get(params, 'data') }) )
 const objectToCheck = _.get(params, 'objectToCheck', {})
 const data = _.get(params, 'data')
 const debug = _.get(params, 'debug')

 
 // add data items to expected properties
 if (data) {
   _.forEach(data, (val, key) => {
     expectedProperties.push({ field: key, value: val })
   })
 }

 _.forEach(expectedProperties, item => {
   let field = _.get(item, 'field')
   let value = _.get(item, 'value')
   let length = _.get(item, 'length')
   let not = _.get(item, 'not')

   let check = objectToCheck
   if (_.get(item, 'path')) {
     if (_.get(item, 'identifier')) {
       let query = {}
       _.set(query, _.get(item, 'identifier.prop'), _.get(item, 'identifier.value'))
       check = _.find(_.get(objectToCheck, item.path), query)
     }
     else {
       let path = _.get(item, 'path', field)
       check = _.get(objectToCheck, path)
     }
   }
   else if (_.get(item, 'identifier')) {
     let query = {}
     _.set(query, _.get(item, 'identifier.prop'), _.get(item, 'identifier.value'))
     check = _.find(objectToCheck, query)
   }

   if (debug) {
     console.log('Check %s | Expected %s', field, value)
   }

   if (not && !value) {
     check.should.not.have.property(field)
   }
   else if (not && value) {
     // check that the field exists but does not equal values
     check.should.have.property(field)
     expect(check).not.to.eql(value)
   }
   else if (_.isNull(value) && _.get(item, 'nullAllowed')) {
     expect(check[field]).to.be.null
   }
   else if (!_.isNil(value)) {
     if (_.isObject(value)) {
       if (_.get(item, 'instruction') === 'include') {
         expect(check[field]).to.deep.include(value)
       }
       else if (_.isArray(value)) {
         // order does not matter - [1,2] - [2,1] should test OK
         expect(check[field]).to.have.deep.members(value)
       }
       else {
         expect(check[field]).to.eql(value)
       }
     }
     else if (!field) {
       if (_.get(item, 'instruction') === 'include') {
         expect(check).to.include(value)
       }
       else {
         expect(check).to.eql(value)
       }
     }
     else {
       if (_.get(item, 'instruction') === 'include') {
         expect(check[field]).to.include(value)
       }
       else if (_.get(item, 'instruction') === 'notinclude') {
         expect(check[field]).to.not.include(value)
       }
       else if (_.get(item, 'instruction') === 'least') {
         expect(check[field]).to.be.at.least(value)
       }
       else if (_.get(item, 'instruction') === 'approx') {
         expect(check[field]).to.be.closeTo(value, _.get(item, 'delta'))
       }
       else {
         check.should.have.property(field, value)
       }
     }
   }
   else check.should.have.property(field)

   if (_.isNumber(length)) {
     check[field].should.have.length(length)
   }


   const type = _.get(item, 'type')
   if (type) {
     check = _.get(check, field)
     if (_.get(item, 'nullAllowed') && _.isNull(check)) {
       expect(check).to.be.null
     }
     else if (type === 'integer') {
       expect(check).to.be.a('number')
     }
     else if (type === 'string') {
       expect(check).to.be.a('string')
     }
     else if (type === 'array') {
       expect(check).to.be.a('Array')
     }
     else if (type === 'boolean') {
       expect(check).to.be.a('Boolean')
     }
     else if (type === 'object') {
       expect(check).to.be.an('object')
     }
   }
 })
}

module.exports = {
  propertiesAndValues,
}