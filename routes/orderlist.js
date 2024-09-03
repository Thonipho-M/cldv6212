var azure = require('azure-storage');
var async = require('async');

module.exports = OrderList;

function OrderList(orders) {
	this.orders = orders;
}

OrderList.prototype = {
    showOrders: function (req, res) {
        self = this;
        var query = new azure.TableQuery()
            .where('completed eq ?', false);
        self.orders.find(query, function itemsFound(error, items) {
            res.render('index', { title: 'My Orders List ', orders: items });
        });
    },

    addTask: function (req, res) {
        var self = this;
        var item = req.body.item;
        self.orders.addItem(item, function itemAdded(error) {
            if (error) {
                throw error;
            }
            res.redirect('/');
        });
    },

    completeOrder: function (req, res) {
        var self = this;
        var completedOrders = Object.keys(req.body);
        async.forEach(completedOrders, function ordersIterator(completedOrder, callback) {
            self.orders.updateItem(completedOrder, function itemsUpdated(error) {
                if (error) {
                    callback(error);
                } else {
                    callback(null);
                }
            });
        }, function goHome(error) {
            if (error) {
                throw error;
            } else {
                res.redirect('/');
            }
        });
    }
}