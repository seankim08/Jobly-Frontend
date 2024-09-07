import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JoblyApi from '../api/api';
import JobCard from './JobCard';

function CompanyDetail() {
  const { handle } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function getCompany() {
      let company = await JoblyApi.getCompany(handle);
      setCompany(company);
    }
    getCompany();
  }, [handle]);

  if (!company) return <div>Loading...</div>;

  return (
    <div className="CompanyDetail col-md-8 offset-md-2">
      <h4>{company.name}</h4>
      <p>{company.description}</p>
      <div className="CompanyDetail-jobs">
        <h5>Jobs at this company</h5>
        {company.jobs.map(job => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            salary={job.salary}
            equity={job.equity}
          />
        ))}
      </div>
    </div>
  );
}

export default CompanyDetail;