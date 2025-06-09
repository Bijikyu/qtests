try{ require('qtests/setup'); }catch{} //(attempt package setup without failing)
require('..').setup(); // (activate stub resolution for jest)
