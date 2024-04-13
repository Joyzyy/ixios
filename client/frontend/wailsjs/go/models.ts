export namespace pb {
	
	export class DataInputType {
	    row?: string;
	    values?: number[];
	
	    static createFrom(source: any = {}) {
	        return new DataInputType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.row = source["row"];
	        this.values = source["values"];
	    }
	}
	export class BCRequest {
	    data?: DataInputType[];
	
	    static createFrom(source: any = {}) {
	        return new BCRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], DataInputType);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class BCResponse {
	    result?: number;
	
	    static createFrom(source: any = {}) {
	        return new BCResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.result = source["result"];
	    }
	}

}

