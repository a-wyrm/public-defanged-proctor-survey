const SA6_page = {

  name: "SA-6_page",
  elements: [
      {
        type: "html",
        name: "consent_text",
        html: '<html><h1 class="text-uppercase" style="font-size:30px;">Security Assessment</h1><br><p class="lead"><p>Before taking part in the initial survey, we will ask you questions about your security attitudes and practices. Please rate the following questions based on how much you agree with them.</p></html>',
      },
      {
        type: "radiogroup",
        name: "SA-6.1",
        title:
          "I seek out opportunities to learn about security measures that are relevant to me.",
        autoGenerate: false,
        isRequired: true,
        choices: [
          {
            value: 1,
            text: "Strongly Disagree",
          },
          {
            value: 2,
            text: "Disagree",
          },
          {
            value: 3,
            text: "Neither Agree or Disagree",
          },
          {
            value: 4,
            text: "Agree",
          },
          {
            value: 5,
            text: "Strongly Agree",
          },
        ],
      },
      {
        type: "radiogroup",
        name: "SA-6.2",
        title:
          "I am extremely motivated to take all the steps needed to keep my online data and accounts safe.",
        autoGenerate: false,
        isRequired: true,
        choices: [
          {
            value: 1,
            text: "Strongly Disagree",
          },
          {
            value: 2,
            text: "Disagree",
          },
          {
            value: 3,
            text: "Neither Agree or Disagree",
          },
          {
            value: 4,
            text: "Agree",
          },
          {
            value: 5,
            text: "Strongly Agree",
          },
        ],
      },
      {
        type: "radiogroup",
        name: "SA-6.3",
        title:
          "Generally, I diligently follow a routine about security practices.",
        autoGenerate: false,
        isRequired: true,
        choices: [
          {
            value: 1,
            text: "Strongly Disagree",
          },
          {
            value: 2,
            text: "Disagree",
          },
          {
            value: 3,
            text: "Neither Agree or Disagree",
          },
          {
            value: 4,
            text: "Agree",
          },
          {
            value: 5,
            text: "Strongly Agree",
          },
        ],
      },
      {
        type: "radiogroup",
        name: "SA-6.4",
        title: "I often am interested in articles about security threats.",
        autoGenerate: false,
        isRequired: true,
        choices: [
          {
            value: 1,
            text: "Strongly Disagree",
          },
          {
            value: 2,
            text: "Disagree",
          },
          {
            value: 3,
            text: "Neither Agree or Disagree",
          },
          {
            value: 4,
            text: "Agree",
          },
          {
            value: 5,
            text: "Strongly Agree",
          },
        ],
      },
      {
        type: "radiogroup",
        name: "SA-6.5",
        title:
          "I always pay attention to experts' advice about the steps I need to take to keep my online data and accounts safe.",
        autoGenerate: false,
        isRequired: true,
        choices: [
          {
            value: 1,
            text: "Strongly Disagree",
          },
          {
            value: 2,
            text: "Disagree",
          },
          {
            value: 3,
            text: "Neither Agree or Disagree",
          },
          {
            value: 4,
            text: "Agree",
          },
          {
            value: 5,
            text: "Strongly Agree",
          },
        ],
      },
      {
        type: "radiogroup",
        name: "SA-6.6",
        title:
          "I am extremely knowledgeable about all the steps needed to keep my online data and accounts safe.",
        autoGenerate: false,
        isRequired: true,
        choices: [
          {
            value: 1,
            text: "Strongly Disagree",
          },
          {
            value: 2,
            text: "Disagree",
          },
          {
            value: 3,
            text: "Neither Agree or Disagree",
          },
          {
            value: 4,
            text: "Agree",
          },
          {
            value: 5,
            text: "Strongly Agree",
          },
        ],
      },
      {
        type: "html",
        name: "exam_next_button",
      },
    ]

};

export default SA6_page;