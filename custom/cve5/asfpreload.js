function getProductListNoVendor(cve) {
    var lines = [];
    for (var affected of cve.containers.cna.affected) {
        lines.push(affected.product);
    }
    return lines.join(", ");
}

async function loadEmailLists(pmc) {
    var listname = "dev";
    try {
	var response = await fetch('/asfemaillists?pmc='+pmc, { method: 'GET' });
	if (response.ok) {
	    var tlp = await response.json();
            if (tlp && tlp["users"]) {
                listname = "users";
            } else if (tlp && tlp["user"]) {
                listname = "user";
            }
	}
    } catch (error) {
        return "security@apache.org";
    }
    return (listname+"@"+pmc+".apache.org");
}

async function loadProductNames() {
    var projects = []
    try {
	var pmcs = userPMCS.split(',');
	var response = await fetch('https://whimsy.apache.org/public/committee-info.json', {
	    method: 'GET',
	    credentials: 'omit',
	    headers: {
		'Accept': 'application/json, text/plain, */*'
	    },
	    redirect: 'error'
	});
	if (!response.ok) {
	    errMsg.textContent = "Failed Apache project list";
	    infoMsg.textContent = "";
	    throw Error(id + ' ' + response.statusText);
	} else {
	    var res = await response.json();
	    if (res.committees) {
		for (var committee in res.committees)
		    if (pmcs.includes(committee) || pmcs.includes('security')) {
			res.committees[committee].display_name &&
			    projects.push('Apache ' + res.committees[committee].display_name);
		    }
	    }
	}
    } catch (error) {
	errMsg.textContent = error;
    }
    return (projects);
}
