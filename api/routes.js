
keyValueStore = {
	store: {},
	// Returns true if value is successfully updated (changed)
	set: function (key, value) {
		// Value isn't changed
		if(this.hasKey(key) && value == this.store[key])
			return false;
		this.store[key] = value;
		return true;
	},
	hasKey: function(key) {
		return key in this.store;
	},
	get: function (key) {
		return this.store[key];
	}
}

module.exports = function (app, db) {
	app.put('/keyValue-store/:key', (req, res) => {
		// if(err.statuscode == 413)
		// 	res.json({
		// 		'result': 'Error',
		// 		'msg': 'Object too large. Size limit is 1MB'
		// 	});
		// else

		if(req.params.key.length < 1 || req.params.key.length > 200)
			res.json({
				'result': 'Error',
				'msg': 'Key not valid'
			});
		else {
			var responseBody = {};
			if(keyValueStore.hasKey(req.params.key)) {
				res.status(200);
				responseBody.msg = "Updated successfully";
				if(keyValueStore.set(req.params.key, req.body.val))
					responseBody.replaced = "True";
				else
					responseBody.replaced = "False";
			} else {
				keyValueStore.set(req.params.key, req.body.val);
				res.status(201);
				responseBody.replaced = "False";
				responseBody.msg = "Added successfully";
			}
			responseBody.keyValueStore = keyValueStore.store;
			res.json(responseBody);
		}

		// console.log(req.body);
		// keyValueStore[req.params.key] = req.body.val;
		// res.send('PUT REQUEST RECEIVED');
	});

	app.post('/test', (req, res) => {
		res.send('POST message received: ' + req.query.msg);
	});

	app.post("/hello", function(req, res) {
		res.status(405).end();
	});

	app.get('/test', (req, res) => {
		res.send('GET request received');
	});

	app.get("/hello", (req, res, next) => { // Why is there next here
		res.send("Hello world!");
	});

	app.searchKey('/search', (req, res) => {
		if(keyValueStore.hasKey(req.param.key)){
			res.status(200);
			/*
			res.json({
				'result': 'Success',
				'isExists': 'true'
			});
			*/
			responseBody.result = "Success"
			responseBody.isExists = "true"
		}else{
			res.status(201);
			/*
			res.json({
				'result': 'Error',
				'isExists': 'false'
			});
			*/
			responseBody.result = "Failed"
			responseBody.isExists = "false"
		}
		res.json(responseBody);
	});

	app.returnKey('/search', (req, res) => {

	});

	app.delete('/keyValue-store/:key', (req, res) => {
		if(keyValueStore.hasKey(req.param.key)){
			res.status(200);
			keyValueStore.remove(req.params.key, req.body.val);
			/*
			res.json({
				'result': 'Success'
			});
			*/
			responseBody.result = "Success"
		}else{
			res.status(404);
			/* res.json({
				'result': 'Error',
				'msg': 'Status code 404'
			}); */
			responseBody.result = "Failed"
			responseBody.msg = "Status code 404"
	}
	res.json(responseBody);
);

}
