var superagent = require('superagent')
var expect = require('expect.js')

describe('express rest api server', function(){
  var id

  it('post object', function(done){
    superagent.post('http://localhost:3000/collections/fiddles')
      .send({ code: {
      html: "<div>some HTML content</div>",
      css: ".some-css{display: none;}",
      js: "var some = 'javascript';"
    }
        , email: 'ggg'
      })
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        id = res.body[0]._id
        done()
      })    
  })

  it('post another object', function(done){
    superagent.post('http://localhost:3000/collections/fiddles')
      .send({ code: {
      html: "<div>HTML2</div>",
      css: ".some-css {display: block;}",
      js: "var some = 'variable';"
    }
        , email: 'ggg'
      })
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        id = res.body[0]._id
        done()
      })    
  })

  it('retrieves an object', function(done){
    superagent.get('http://localhost:3000/collections/fiddles/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body._id).to.eql(id)        
        done()
      })
  })

  it('retrieves a collection', function(done){
    superagent.get('http://localhost:3000/collections/fiddles')
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body.map(function (item){return item._id})).to.contain(id)        
        done()
      })
  })

  it('updates an object', function(done){
    superagent.put('http://localhost:3000/collections/fiddles/'+id)
      .send({code: { html: "<div>some HTML content</div>",
                    css: ".some-css{display: none;}",
                    js: "var some = 'thing else';"
                    }
        , email: 'n@g.com'})
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.msg).to.eql('success')        
        done()
      })
  })
  it('checks an updated object', function(done){
    superagent.get('http://localhost:3000/collections/fiddles/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body._id).to.eql(id)        
        expect(res.body.email).to.eql('n@g.com')        
        done()
      })
  })    
  
  it('removes an object', function(done){
    superagent.del('http://localhost:3000/collections/fiddles/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.msg).to.eql('success')    
        done()
      })
  })      
})

