/* Contexte commun du professeur — lecture seule, sans nouvelle source de vérité. */
(function (root) {
  'use strict';
  if (root.TEACHER_CONTEXT && root.TEACHER_CONTEXT.__v1__) return;

  function clean(value, max) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
  }

  function build(question) {
    var current = {};
    try {
      if (root.CONTEXT && typeof root.CONTEXT.ctx === 'function') {
        current = root.CONTEXT.ctx() || {};
      }
    } catch (e) {}

    var subjectId = clean(current.subject, 40) || 'inconnu';
    var subject = null;
    try {
      if (root.SUBJECT && typeof root.SUBJECT.get === 'function') {
        subject = root.SUBJECT.get(subjectId);
      }
    } catch (e) {}

    var language = '';
    try {
      var selector = root.document && root.document.getElementById('chatVoiceLang');
      language = clean(selector && selector.value, 12);
    } catch (e) {}

    var snapshot = {
      schema: 'teacher-context-v1',
      trust: 'client_unverified',
      question: clean(question, 600),
      subject: {
        id: subjectId,
        name: clean(subject && subject.name, 60) || subjectId,
        status: clean(subject && subject.status, 20) || 'unknown'
      },
      level: clean(current.level, 20) || 'tous',
      track: clean(current.track, 40) || null,
      dictationLanguage: language || null,
      responseLanguage: 'auto',
      retrievedSources: []
    };
    return JSON.stringify(snapshot);
  }

  root.TEACHER_CONTEXT = Object.freeze({ __v1__: true, build: build });
})(typeof window !== 'undefined' ? window : globalThis);
