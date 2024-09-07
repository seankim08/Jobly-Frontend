import React, { useState, useEffect } from 'react';
import JoblyApi from '../api/api';
import JobCard from './JobCard';
import SearchForm from './SearchForm';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(function getAllJobsOnMount() {
    search();
  }, []);

  async function search(title) {
    let jobs = await JoblyApi.getJobs(title);
    setJobs(jobs);
  }

  return (
      <div className="JobList col-md-8 offset-md-2">
        <SearchForm searchFor={search} />
        {jobs.length
            ? (
                <div className="JobList-list">
                  {jobs.map(job => (
                      <JobCard
                          key={job.id}
                          id={job.id}
                          title={job.title}
                          salary={job.salary}
                          equity={job.equity}
                          companyName={job.companyName}
                      />
                  ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default JobList;